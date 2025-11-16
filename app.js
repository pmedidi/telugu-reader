// app.js

/* ===== IndexedDB Utilities ===== */
const DB_NAME = 'telugu_reader_db';
const DB_VERSION = 1;

let db;

async function openDB() {
  // If db exists but connection is closed, reset it
  if (db) {
    try {
      // Test if connection is still valid by checking objectStoreNames
      db.objectStoreNames;
      return db;
    } catch (e) {
      // Connection was closed/invalidated, reset
      db = null;
    }
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (e) => {
      const database = e.target.result;

      // Sentences store
      if (!database.objectStoreNames.contains('sentences')) {
        database.createObjectStore('sentences', { keyPath: 'id' });
      }

      // Glossary store
      if (!database.objectStoreNames.contains('glossary')) {
        database.createObjectStore('glossary', { keyPath: 'term_en' });
      }

      // Feedback store
      if (!database.objectStoreNames.contains('feedback')) {
        database.createObjectStore('feedback', { keyPath: 'id', autoIncrement: true });
      }

      // Analytics store
      if (!database.objectStoreNames.contains('analytics')) {
        database.createObjectStore('analytics', { keyPath: 'key' });
      }
    };
  });
}

async function getAll(storeName) {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function put(storeName, data) {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.put(data);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function add(storeName, data) {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.add(data);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function get(storeName, key) {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Expose IndexedDB functions globally for ai-helpers.js
window.getAll = getAll;
window.put = put;
window.add = add;
window.get = get;
window.openDB = openDB;
window.DB_NAME = DB_NAME;
window.DB_VERSION = DB_VERSION;

/* ===== App State ===== */
let sentences = [];
let glossary = {};
let primaryLang = 'en'; // 'en' or 'te'
let allSentencesData = []; // Full data from JSON (for lazy loading)
let isLoading = false;
const PAGE_SIZE = 20;

// Expose sentences array getter for ai-helpers.js
window.getSentences = () => sentences;

/* ===== Bootstrap & Data Seeding ===== */

async function bootstrap() {
  try {
    await openDB();

    // Load sentences JSON directly (no IndexedDB seeding for sentences)
    console.log('Loading sentences...');
    const sentencesResponse = await fetch('/data/sentences.json');
    allSentencesData = await sentencesResponse.json();
    console.log(`Loaded ${allSentencesData.length} sentences`);

    // Load first page of sentences
    sentences = allSentencesData.slice(0, PAGE_SIZE);

    // Load glossary (still need this for term highlighting)
    const existingGlossary = await getAll('glossary');
    if (existingGlossary.length === 0) {
      console.log('Seeding glossary...');
      const response = await fetch('/data/glossary.json');
      const data = await response.json();
      // Batch insert glossary
      const database = await openDB();
      await new Promise((resolve, reject) => {
        const tx = database.transaction('glossary', 'readwrite');
        const store = tx.objectStore('glossary');
        for (const item of data) {
          store.put(item);
        }
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
      console.log(`Seeded ${data.length} glossary terms`);
    }

    const glossaryArray = await getAll('glossary');
    glossary = Object.fromEntries(glossaryArray.map(t => [t.term_en.toLowerCase(), t]));

    // Render UI
    renderReader();
    populateSentenceSelect();
    renderTopTerms();

    // Setup infinite scroll
    setupInfiniteScroll();

  } catch (err) {
    console.warn('Bootstrap error:', err);
  }
}

// Load more sentences when scrolling
function loadMoreSentences() {
  if (isLoading || sentences.length >= allSentencesData.length) return;

  isLoading = true;
  const nextBatch = allSentencesData.slice(sentences.length, sentences.length + PAGE_SIZE);

  if (nextBatch.length > 0) {
    sentences = sentences.concat(nextBatch);
    appendSentences(nextBatch);
    console.log(`Loaded ${sentences.length}/${allSentencesData.length} sentences`);
  }

  isLoading = false;
}

// Append new sentences to the reader (without re-rendering all)
function appendSentences(newSentences) {
  const reader = document.getElementById('reader');

  newSentences.forEach(s => {
    const pair = createSentencePair(s);
    reader.appendChild(pair);
  });

  updateLoadMoreButton();
}

// Setup infinite scroll listener
function setupInfiniteScroll() {
  // Add "Load More" button
  const loadMoreBtn = document.createElement('button');
  loadMoreBtn.id = 'loadMoreBtn';
  loadMoreBtn.textContent = `Load More (${sentences.length}/${allSentencesData.length})`;
  loadMoreBtn.className = 'load-more-btn';
  loadMoreBtn.addEventListener('click', loadMoreSentences);
  document.getElementById('reader').after(loadMoreBtn);

  // Also load on scroll near bottom
  window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
      loadMoreSentences();
    }
  });
}

function updateLoadMoreButton() {
  const btn = document.getElementById('loadMoreBtn');
  if (btn) {
    if (sentences.length >= allSentencesData.length) {
      btn.textContent = 'All sentences loaded';
      btn.disabled = true;
    } else {
      btn.textContent = `Load More (${sentences.length}/${allSentencesData.length})`;
    }
  }
}

/* ===== Reader Rendering ===== */

// Create a single sentence pair element
function createSentencePair(s) {
  const pair = document.createElement('div');
  pair.className = 'sentence-pair';
  pair.id = `sentence-${s.id}`;

  const enDiv = document.createElement('div');
  enDiv.className = `sentence ${primaryLang === 'en' ? 'primary' : 'secondary'}`;
  enDiv.lang = 'en';
  enDiv.innerHTML = wrapTerms(s.en);

  const teDiv = document.createElement('div');
  teDiv.className = `sentence ${primaryLang === 'te' ? 'primary' : 'secondary'}`;
  teDiv.lang = 'te';
  teDiv.textContent = s.te;

  // Show simplified badge if available
  if (s.te_simplified) {
    const simplifiedBadge = document.createElement('div');
    simplifiedBadge.className = 'simplified-badge';
    simplifiedBadge.innerHTML = `
      <span class="badge-icon">✓ Simplified version available</span>
      <button class="view-simplified-btn" data-sid="${s.id}">View</button>
    `;
    teDiv.appendChild(simplifiedBadge);
  }

  // Add AI tools menu
  const aiTools = document.createElement('div');
  aiTools.className = 'ai-tools';
  aiTools.innerHTML = `
    <button class="ai-btn" data-action="simplify" data-sid="${s.id}" title="Simplify Telugu text for 7th grade">
      🪄 Simplify
    </button>
    <button class="ai-btn" data-action="backcheck" data-sid="${s.id}" title="Check translation accuracy">
      🔄 Back-check
    </button>
    <button class="ai-btn" data-action="cultural" data-sid="${s.id}" title="Review cultural appropriateness">
      🌍 Cultural
    </button>
  `;

  if (primaryLang === 'en') {
    pair.appendChild(enDiv);
    pair.appendChild(teDiv);
  } else {
    pair.appendChild(teDiv);
    pair.appendChild(enDiv);
  }

  pair.appendChild(aiTools);
  return pair;
}

function renderReader() {
  const reader = document.getElementById('reader');
  reader.innerHTML = '';

  sentences.forEach(s => {
    const pair = createSentencePair(s);
    reader.appendChild(pair);
  });

  // Update language toggle label
  document.getElementById('langLabel').textContent =
    primaryLang === 'en' ? 'Primary: English' : 'Primary: Telugu';
}

function wrapTerms(text) {
  const glossaryTerms = Object.keys(glossary);
  // Sort by length descending to match longer terms first
  glossaryTerms.sort((a, b) => b.length - a.length);

  let result = text;
  glossaryTerms.forEach(term => {
    // Case-insensitive replacement with word boundaries
    const regex = new RegExp(`\\b(${term})\\b`, 'gi');
    result = result.replace(regex, (match) => {
      return `<span class="term" data-term="${term.toLowerCase()}" tabindex="0" role="button" aria-label="Define ${match}">${match}</span>`;
    });
  });

  return result;
}

function populateSentenceSelect() {
  const select = document.getElementById('feedbackSentence');
  sentences.forEach((s, idx) => {
    const option = document.createElement('option');
    option.value = s.id;
    option.textContent = `${idx + 1}. ${s.en.substring(0, 50)}...`;
    select.appendChild(option);
  });
}

/* ===== Glossary Panel ===== */
function openGlossary(termKey) {
  const term = glossary[termKey.toLowerCase()];
  if (!term) return;

  document.getElementById('glossaryTitle').textContent = term.term_en;
  document.getElementById('glossaryTerm').textContent = term.term_te;

  const defsList = document.getElementById('glossaryDefs');
  defsList.innerHTML = '';
  term.defs.forEach(def => {
    const li = document.createElement('li');
    li.textContent = def;
    defsList.appendChild(li);
  });

  const examplesList = document.getElementById('glossaryExamples');
  examplesList.innerHTML = '';
  term.examples.forEach(ex => {
    const li = document.createElement('li');
    li.textContent = ex;
    examplesList.appendChild(li);
  });

  const panel = document.getElementById('glossaryPanel');
  panel.hidden = false;
  document.getElementById('closeGlossary').focus();

  // Track analytics (local IndexedDB)
  incrementAnalytics(`gloss:${term.term_en}`);
  renderTopTerms();

  // Track with Vercel Analytics (if available)
  if (window.va) {
    window.va('event', { name: 'glossary_lookup', term: term.term_en });
  }
}

function closeGlossary() {
  document.getElementById('glossaryPanel').hidden = true;
}

async function incrementAnalytics(key) {
  try {
    let record = await get('analytics', key);
    if (record) {
      record.count++;
    } else {
      record = { key, count: 1 };
    }
    await put('analytics', record);
  } catch (err) {
    console.warn('Analytics error:', err);
  }
}

// Expose incrementAnalytics globally for ai-helpers.js
window.incrementAnalytics = incrementAnalytics;

// Show saved simplified version
function showSimplifiedModal(sentence) {
  const panel = document.getElementById('glossaryPanel');
  const contentDiv = document.getElementById('glossaryContent');

  const html = `
    <h2>Saved Simplified Version</h2>
    <div class="ai-result">
      <h3>Original Telugu:</h3>
      <p lang="te" class="original-text">${sentence.te_original || sentence.te}</p>

      <h3>Simplified Telugu:</h3>
      <p lang="te" class="simplified-text">${sentence.te_simplified}</p>

      <h3>Original English:</h3>
      <p class="original-text">${sentence.en}</p>
    </div>
  `;

  contentDiv.innerHTML = html;
  panel.hidden = false;
  document.getElementById('closeGlossary').focus();
}

// Expose for ai-helpers.js
window.showSimplifiedModal = showSimplifiedModal;
window.renderReader = renderReader;
window.sentences = sentences;

async function renderTopTerms() {
  try {
    const analytics = await getAll('analytics');
    const glossAnalytics = analytics.filter(a => a.key.startsWith('gloss:'));
    glossAnalytics.sort((a, b) => b.count - a.count);
    const top5 = glossAnalytics.slice(0, 5);

    const list = document.getElementById('topTermsList');
    list.innerHTML = '';

    if (top5.length === 0) {
      list.innerHTML = '<li style="border:none;padding-left:0;">No terms viewed yet</li>';
      return;
    }

    top5.forEach(item => {
      const termName = item.key.replace('gloss:', '');
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${termName}</span>
        <span class="term-count">${item.count}</span>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    console.warn('Top terms error:', err);
  }
}

/* ===== Feedback ===== */
async function handleFeedbackSubmit(e) {
  e.preventDefault();

  const type = document.getElementById('feedbackType').value;
  const text = document.getElementById('feedbackText').value;
  const sentenceId = document.getElementById('feedbackSentence').value;

  const feedback = {
    type,
    text,
    sentenceId: sentenceId ? parseInt(sentenceId) : null,
    tsISO: new Date().toISOString()
  };

  try {
    await add('feedback', feedback);

    // Show success
    const status = document.getElementById('feedbackStatus');
    status.textContent = 'Feedback saved successfully!';
    status.className = 'success';

    // Reset form
    e.target.reset();

    // Clear status after 3s
    setTimeout(() => {
      status.textContent = '';
      status.className = '';
    }, 3000);

  } catch (err) {
    console.warn('Feedback error:', err);
  }
}

async function downloadFeedback() {
  try {
    const feedbackData = await getAll('feedback');
    const blob = new Blob([JSON.stringify(feedbackData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.warn('Download error:', err);
  }
}

/* ===== Event Listeners ===== */
document.addEventListener('DOMContentLoaded', () => {
  bootstrap();

  // Language toggle
  document.getElementById('langToggle').addEventListener('click', () => {
    primaryLang = primaryLang === 'en' ? 'te' : 'en';
    renderReader();
  });

  // Glossary term clicks (delegated)
  document.getElementById('reader').addEventListener('click', (e) => {
    if (e.target.classList.contains('term')) {
      openGlossary(e.target.dataset.term);
    }
    // View simplified version
    if (e.target.classList.contains('view-simplified-btn')) {
      const sid = parseInt(e.target.dataset.sid);
      const sentence = sentences.find(s => s.id === sid);
      if (sentence && sentence.te_simplified) {
        showSimplifiedModal(sentence);
      }
    }
  });

  // Glossary term keyboard
  document.getElementById('reader').addEventListener('keydown', (e) => {
    if (e.target.classList.contains('term') && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      openGlossary(e.target.dataset.term);
    }
  });

  // Close glossary
  document.getElementById('closeGlossary').addEventListener('click', closeGlossary);

  // ESC to close glossary
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !document.getElementById('glossaryPanel').hidden) {
      closeGlossary();
    }
  });

  // Trap focus in glossary panel
  document.getElementById('glossaryPanel').addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const panel = document.getElementById('glossaryPanel');
      const focusable = panel.querySelectorAll('button, [tabindex="0"]');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Feedback form
  document.getElementById('feedbackForm').addEventListener('submit', handleFeedbackSubmit);

  // Download feedback
  document.getElementById('downloadFeedback').addEventListener('click', downloadFeedback);
});

/* ===== Service Worker Registration ===== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.warn('SW registration failed:', err));
  });
}
