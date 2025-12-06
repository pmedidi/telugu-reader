// ai-helpers.js
// AI-assisted features for Telugu Science Reader
// Pawan Medidi - CS6460

/* ===== Analytics Helper ===== */
// Track custom events with Vercel Analytics (if available)
function trackEvent(eventName, properties = {}) {
  // Vercel Analytics
  if (window.va) {
    window.va('event', { name: eventName, ...properties });
  }
  // Also log to console for debugging
  console.log(`Analytics: ${eventName}`, properties);
}

/* ===== AI API Calls ===== */

// Main AI call function - handles online/offline states
async function aiCall(task, payload) {
  // Check if online
  if (!navigator.onLine) {
    await queueAI({ task, payload, ts: Date.now() });
    throw new Error('Currently offline. Request queued for when connection returns.');
  }

  // Check cache first
  const cacheKey = `ai:${task}:${JSON.stringify(payload)}`;
  const cached = await getAICache(cacheKey);
  if (cached) {
    console.log('AI: Using cached result');
    return cached;
  }

  // Call API
  const apiUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api/ai'  // Local Vercel dev server
    : '/api/ai';  // Production

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, payload }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`AI API error: ${errorText}`);
    }

    const result = await res.json();

    // Cache the result
    await cacheAIResult(cacheKey, result);

    return result;
  } catch (error) {
    console.error('AI call failed:', error);
    throw error;
  }
}

/* ===== AI Queue for Offline Requests ===== */

async function queueAI(job) {
  const database = await window.openDB();
  return new Promise((resolve, reject) => {
    // Check if aiQueue store exists
    if (!database.objectStoreNames.contains('aiQueue')) {
      // Need to upgrade database
      const currentVersion = database.version;
      database.close();

      const upgradeRequest = indexedDB.open(window.DB_NAME, currentVersion + 1);

      upgradeRequest.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('aiQueue')) {
          db.createObjectStore('aiQueue', { keyPath: 'ts' });
        }
      };

      upgradeRequest.onsuccess = () => {
        // DB upgraded, retry the operation
        queueAI(job).then(resolve).catch(reject);
      };

      upgradeRequest.onerror = () => reject(upgradeRequest.error);
      return;
    }

    const tx = database.transaction('aiQueue', 'readwrite');
    const store = tx.objectStore('aiQueue');
    store.put(job);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Process queued AI requests when back online
async function processAIQueue() {
  if (!navigator.onLine) return;

  const database = await window.openDB();
  if (!database.objectStoreNames.contains('aiQueue')) return;

  const queue = await window.getAll('aiQueue');
  console.log(`Processing ${queue.length} queued AI requests`);

  for (const job of queue) {
    try {
      await aiCall(job.task, job.payload);
      // Remove from queue - just log for now, queue will clear on next session
      console.log('Processed queued job:', job.ts);
    } catch (error) {
      console.error('Failed to process queued AI job:', error);
    }
  }
}

/* ===== AI Result Caching ===== */

async function cacheAIResult(key, value) {
  const database = await window.openDB();
  return new Promise((resolve, reject) => {
    if (!database.objectStoreNames.contains('aiCache')) {
      const currentVersion = database.version;
      database.close();

      const upgradeRequest = indexedDB.open(window.DB_NAME, currentVersion + 1);

      upgradeRequest.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('aiCache')) {
          db.createObjectStore('aiCache', { keyPath: 'key' });
        }
      };

      upgradeRequest.onsuccess = () => {
        // DB upgraded, retry the operation
        cacheAIResult(key, value).then(resolve).catch(reject);
      };

      upgradeRequest.onerror = () => reject(upgradeRequest.error);
      return;
    }

    const tx = database.transaction('aiCache', 'readwrite');
    const store = tx.objectStore('aiCache');
    store.put({ key, value, ts: Date.now() });

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getAICache(key) {
  const database = await window.openDB();
  if (!database.objectStoreNames.contains('aiCache')) return null;

  return new Promise((resolve, reject) => {
    const tx = database.transaction('aiCache', 'readonly');
    const store = tx.objectStore('aiCache');
    const request = store.get(key);

    request.onsuccess = () => {
      const result = request.result;
      resolve(result ? result.value : null);
    };
    request.onerror = () => reject(request.error);
  });
}

/* ===== AI Modal UI ===== */

function showAIModal(title, content, options = {}) {
  const panel = document.getElementById('glossaryPanel');
  const contentDiv = document.getElementById('glossaryContent');

  let html = `<h2>${title}</h2>`;

  if (options.aiWarning !== false) {
    html += `<div class="ai-warning">⚠️ AI-assisted output. Please verify before classroom use.</div>`;
  }

  html += content;

  if (options.acceptButton) {
    html += `<button class="ai-accept" data-action="${options.acceptAction}">${options.acceptButton}</button>`;
  }

  contentDiv.innerHTML = html;
  panel.hidden = false;

  // Focus close button
  document.getElementById('closeGlossary').focus();
}

function hideAIModal() {
  document.getElementById('glossaryPanel').hidden = true;
}

/* ===== AI Task Handlers ===== */

async function handleSimplifyTelugu(sentenceId) {
  // Use in-memory sentences array (from lazy loading)
  const sentences = window.getSentences ? window.getSentences() : await window.getAll('sentences');
  const sentence = sentences.find(s => s.id === sentenceId);

  if (!sentence) {
    showAIModal('Error', '<p>Sentence not found</p>', { aiWarning: false });
    return;
  }

  try {
    showAIModal('Simplifying...', '<p>⏳ Calling AI to simplify Telugu text...</p>', { aiWarning: false });

    const result = await aiCall('simplify_te', {
      te: sentence.te,
      en: sentence.en,
      grade: 7
    });

    // Track AI feature usage
    trackEvent('ai_simplify', { sentenceId });

    const content = `
      <div class="ai-result">
        <h3>Original Telugu:</h3>
        <p lang="te" class="original-text">${sentence.te}</p>

        <h3>Simplified Telugu:</h3>
        <p lang="te" class="simplified-text">${result.simplified_te}</p>

        <h3>Simplified English:</h3>
        <p class="simplified-text">${result.simplified_en || 'Not available'}</p>

        <h3>Changes Made:</h3>
        <p class="changes-text">${result.changes || 'Text simplified for 7th-grade reading level'}</p>
      </div>
    `;

    showAIModal('Simplified Telugu', content, {
      acceptButton: 'Save as Alternate',
      acceptAction: `save-simplified:${sentenceId}:${encodeURIComponent(JSON.stringify(result))}`
    });

    // Track analytics
    await window.incrementAnalytics('ai:simplify');

  } catch (error) {
    showAIModal('AI Error', `<p class="error-msg">${error.message}</p>`, { aiWarning: false });
  }
}

async function handleBackCheck(sentenceId) {
  // Use in-memory sentences array (from lazy loading)
  const sentences = window.getSentences ? window.getSentences() : await window.getAll('sentences');
  const sentence = sentences.find(s => s.id === sentenceId);

  if (!sentence) {
    showAIModal('Error', '<p>Sentence not found</p>', { aiWarning: false });
    return;
  }

  try {
    showAIModal('Checking...', '<p>⏳ Performing back-translation check...</p>', { aiWarning: false });

    const result = await aiCall('back_check', {
      en: sentence.en,
      te: sentence.te
    });

    // Track AI feature usage
    trackEvent('ai_backcheck', { sentenceId, fidelity: result.fidelity });

    const fidelityPercent = (result.fidelity * 100).toFixed(0);
    const fidelityClass = result.fidelity >= 0.8 ? 'high-fidelity' : 'low-fidelity';

    const content = `
      <div class="ai-result">
        <h3>Original English:</h3>
        <p class="original-text">${sentence.en}</p>

        <h3>Telugu Translation:</h3>
        <p lang="te" class="original-text">${sentence.te}</p>

        <h3>Back-translated to English:</h3>
        <p class="back-translation">${result.back_en}</p>

        <h3>Fidelity Score:</h3>
        <p class="fidelity-score ${fidelityClass}">${fidelityPercent}% match</p>

        <h3>Analysis:</h3>
        <p class="analysis-notes">${result.notes}</p>
      </div>
    `;

    showAIModal('Back-Translation Check', content);

    // Track analytics
    await window.incrementAnalytics('ai:backcheck');

  } catch (error) {
    showAIModal('AI Error', `<p class="error-msg">${error.message}</p>`, { aiWarning: false });
  }
}

async function handleGenerateGloss(term) {
  try {
    showAIModal('Generating...', '<p>⏳ Creating glossary entry...</p>', { aiWarning: false });

    const result = await aiCall('generate_gloss', {
      term_en: term,
      context_en: 'Heat transfer science for 7th grade students'
    });

    const content = `
      <div class="ai-result">
        <h3>English Term:</h3>
        <p class="term-display">${result.term_en}</p>

        <h3>Telugu Term:</h3>
        <p lang="te" class="term-display">${result.term_te}</p>

        <h3>Definition (English):</h3>
        <p>${result.def_en}</p>

        <h3>Definition (Telugu):</h3>
        <p lang="te">${result.def_te}</p>

        <h3>Example (English):</h3>
        <p>${result.example_en}</p>

        <h3>Example (Telugu):</h3>
        <p lang="te">${result.example_te}</p>
      </div>
    `;

    showAIModal('Generated Glossary Entry', content, {
      acceptButton: 'Add to Glossary',
      acceptAction: `save-gloss:${encodeURIComponent(JSON.stringify(result))}`
    });

    // Track analytics
    await window.incrementAnalytics('ai:generate_gloss');

  } catch (error) {
    showAIModal('AI Error', `<p class="error-msg">${error.message}</p>`, { aiWarning: false });
  }
}

async function handleCulturalReview(sentenceId) {
  // Use in-memory sentences array (from lazy loading)
  const sentences = window.getSentences ? window.getSentences() : await window.getAll('sentences');
  const sentence = sentences.find(s => s.id === sentenceId);

  if (!sentence) {
    showAIModal('Error', '<p>Sentence not found</p>', { aiWarning: false });
    return;
  }

  try {
    showAIModal('Reviewing...', '<p>⏳ Checking cultural appropriateness...</p>', { aiWarning: false });

    const result = await aiCall('cultural_review', {
      en: sentence.en,
      te: sentence.te
    });

    // Track AI feature usage
    trackEvent('ai_cultural_review', { sentenceId, risk: result.risk });

    const riskClass = result.risk === 'high' ? 'risk-high' : result.risk === 'medium' ? 'risk-medium' : 'risk-low';

    const content = `
      <div class="ai-result">
        <h3>Risk Level:</h3>
        <p class="risk-level ${riskClass}">${result.risk.toUpperCase()}</p>

        <h3>Notes:</h3>
        <ul class="review-notes">
          ${result.notes.map(note => `<li>${note}</li>`).join('')}
        </ul>

        <h3>Suggestions:</h3>
        <p class="suggestions">${result.suggestions}</p>
      </div>
    `;

    showAIModal('Cultural Appropriateness Review', content);

    // Track analytics
    await window.incrementAnalytics('ai:cultural_review');

  } catch (error) {
    showAIModal('AI Error', `<p class="error-msg">${error.message}</p>`, { aiWarning: false });
  }
}

/* ===== Event Listeners ===== */

// Initialize AI features when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  // Listen for online/offline events
  window.addEventListener('online', () => {
    console.log('Back online - processing queued AI requests');
    processAIQueue();
  });

  window.addEventListener('offline', () => {
    console.log('Gone offline - AI requests will be queued');
  });

  // Handle AI button clicks
  document.addEventListener('click', async (e) => {
    const aiBtn = e.target.closest('.ai-btn');
    if (!aiBtn) return;

    e.preventDefault();
    const action = aiBtn.dataset.action;
    const sid = parseInt(aiBtn.dataset.sid);

    switch (action) {
      case 'simplify':
        await handleSimplifyTelugu(sid);
        break;
      case 'backcheck':
        await handleBackCheck(sid);
        break;
      case 'cultural':
        await handleCulturalReview(sid);
        break;
      default:
        console.warn('Unknown AI action:', action);
    }
  });

  // Handle accept button in AI modal
  document.addEventListener('click', async (e) => {
    const acceptBtn = e.target.closest('.ai-accept');
    if (!acceptBtn) return;

    const actionData = acceptBtn.dataset.action;
    if (!actionData) return;

    const [action, ...params] = actionData.split(':');

    switch (action) {
      case 'save-simplified':
        // Save simplified version by updating the sentence
        const [sid, simplifiedData] = params;
        const sentenceId = parseInt(sid);
        console.log('Saving simplified version for sentence', sentenceId);

        try {
          // Parse the result object
          const result = JSON.parse(decodeURIComponent(simplifiedData));

          // Update in-memory array
          const memSentences = window.getSentences ? window.getSentences() : [];
          const memSentence = memSentences.find(s => s.id === sentenceId);
          if (memSentence) {
            // Store original if not already saved
            if (!memSentence.te_original) {
              memSentence.te_original = memSentence.te;
            }
            if (!memSentence.en_original) {
              memSentence.en_original = memSentence.en;
            }
            // Save all simplified data
            memSentence.te_simplified = result.simplified_te;
            memSentence.en_simplified = result.simplified_en;
            memSentence.simplification_changes = result.changes;

            // Re-render to show badge
            if (window.renderReader) {
              window.renderReader();
            }

            trackEvent('ai_save_simplified', { sentenceId });
            hideAIModal();
            showNotification('Simplified version saved! You can now view it anytime.', 'success');
          }
        } catch (err) {
          console.error('Error saving simplified version:', err);
          showNotification('Error saving: ' + err.message, 'error');
        }
        break;

      case 'save-gloss':
        // Add generated glossary entry
        const glossData = JSON.parse(decodeURIComponent(params[0]));
        console.log('Saving glossary entry:', glossData);

        try {
          await window.put('glossary', glossData);
          trackEvent('ai_save_glossary', { term: glossData.term_en });
          hideAIModal();
          showNotification('Glossary entry added!', 'success');
        } catch (err) {
          console.error('Error saving glossary:', err);
          showNotification('Error saving: ' + err.message, 'error');
        }
        break;

      default:
        console.warn('Unknown accept action:', action);
    }
  });
});

// Helper function for notifications (better than alert)
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10001;
    animation: slideIn 0.3s ease-out;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
  `;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
