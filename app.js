// app.js

/* ===== IndexedDB Utilities ===== */
const DB_NAME = 'telugu_reader_db';
const DB_VERSION = 1;

let db;

async function openDB() {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

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

/* ===== App State ===== */
let sentences = [];
let glossary = {};
let primaryLang = 'en'; // 'en' or 'te'

/* ===== Bootstrap & Data Seeding ===== */
async function bootstrap() {
  try {
    await openDB();

    // Check if data exists
    const existingSentences = await getAll('sentences');
    const existingGlossary = await getAll('glossary');

    // Seed if empty
    if (existingSentences.length === 0) {
      console.log('Seeding sentences...');
      const response = await fetch('/data/sentences.json');
      const data = await response.json();
      for (const sentence of data) {
        await put('sentences', sentence);
      }
    }

    if (existingGlossary.length === 0) {
      console.log('Seeding glossary...');
      const response = await fetch('/data/glossary.json');
      const data = await response.json();
      for (const term of data) {
        await put('glossary', term);
      }
    }

    // Load data into memory
    sentences = await getAll('sentences');
    const glossaryArray = await getAll('glossary');
    glossary = Object.fromEntries(glossaryArray.map(t => [t.term_en.toLowerCase(), t]));

    // Render UI
    renderReader();
    populateSentenceSelect();
    renderTopTerms();

  } catch (err) {
    console.warn('Bootstrap error:', err);
  }
}

/* ===== Reader Rendering ===== */
function renderReader() {
  const reader = document.getElementById('reader');
  reader.innerHTML = '';

  sentences.forEach(s => {
    const pair = document.createElement('div');
    pair.className = 'sentence-pair';

    const enDiv = document.createElement('div');
    enDiv.className = `sentence ${primaryLang === 'en' ? 'primary' : 'secondary'}`;
    enDiv.lang = 'en';
    enDiv.innerHTML = wrapTerms(s.en);

    const teDiv = document.createElement('div');
    teDiv.className = `sentence ${primaryLang === 'te' ? 'primary' : 'secondary'}`;
    teDiv.lang = 'te';
    teDiv.textContent = s.te;

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

  // Track analytics
  incrementAnalytics(`gloss:${term.term_en}`);
  renderTopTerms();
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
