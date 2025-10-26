# AI-Assisted Features

**Telugu-English Science Reader**
**Author:** Pawan Medidi
**Date:** January 2025

---

## Overview

The Telugu Reader now includes **AI-assisted tools** to help teachers refine content quality. These features:

- ✅ **Run only when online** (requires internet connection)
- ✅ **Cache results offline** (reusable without network)
- ✅ **Keep API key secure** (stored in serverless function, never exposed to browser)
- ✅ **Provide guardrails** (warnings, side-by-side comparisons, no auto-overwrite)

---

## Features

### 1. 🪄 Simplify Telugu
**Purpose:** Reduce reading complexity for struggling 7th graders

**How it works:**
- Click "🪄 Simplify" on any sentence
- AI rewrites Telugu text at 7th-grade reading level
- Shows original vs simplified side-by-side
- Teacher can save as alternate version

**Use case:** When pilot tests show students struggle with technical vocabulary

---

### 2. 🔄 Back-Translation Check
**Purpose:** Verify translation fidelity

**How it works:**
- Click "🔄 Back-check" on any sentence
- AI translates Telugu → English
- Compares back-translation to original English
- Shows fidelity score (0-100%) + mismatch notes

**Use case:** Quality assurance for corpus, identify meaning drift

---

### 3. 🌍 Cultural Appropriateness Review
**Purpose:** Flag culturally insensitive or unfamiliar examples

**How it works:**
- Click "🌍 Cultural" on any sentence
- AI reviews for cultural issues (urban bias, gender bias, regional sensitivity)
- Assigns risk level (low/medium/high)
- Provides improvement suggestions

**Use case:** Ensure examples resonate with Telugu-speaking students from diverse backgrounds

---

### 4. Generate Glossary Entry (Future)
**Purpose:** Auto-create term definitions + examples

**How it works:**
- Enter new scientific term
- AI generates:
  - Telugu translation
  - Age-appropriate definition
  - Everyday example
- Teacher reviews and accepts

**Use case:** Quickly expand glossary to 800+ terms

---

## Technical Architecture

### Serverless Function (`/api/ai.js`)

```
Browser → /api/ai (Vercel Function) → OpenAI API
                ↓
         IndexedDB Cache
                ↓
         Offline Reuse
```

**Security:**
- API key stored in Vercel environment variable
- Never exposed to browser/frontend
- CORS headers for local development

**Model:** GPT-4o-mini (fast, cost-effective)

**Temperature:** 0.3 (consistent, less creative)

**Max Tokens:** 500 (concise outputs)

---

## Caching Strategy

### Cache Key Format:
```
ai:${task}:${JSON.stringify(payload)}
```

### Example:
```javascript
Key: "ai:simplify_te:{"te":"వేడి అనేది శక్తి...","grade":7}"
Value: {"simplified_te":"...","changes":"...","_meta":{...}}
```

### Cache Behavior:
1. **First request:** Fetch from OpenAI → Cache in IndexedDB
2. **Subsequent requests:** Read from IndexedDB (instant, works offline)
3. **Cache invalidation:** Manual (teachers can clear cache)

---

## AI Prompts

### Simplify Telugu
```
Task: Simplify Telugu sentence for 7th grade
Input: original Telugu
Output: {"simplified_te": "...", "changes": "..."}
Constraints: ≤25 words, keep science meaning intact
```

### Back-Translation Check
```
Task: Translate TE→EN, compare to original
Input: {en, te}
Output: {"back_en": "...", "fidelity": 0.85, "notes": "..."}
```

### Cultural Review
```
Task: Check for cultural issues
Input: {en, te}
Output: {"risk": "low|medium|high", "notes": [...], "suggestions": "..."}
```

---

## Guardrails

### 1. **No Auto-Overwrite**
- AI suggestions shown side-by-side with original
- Teacher must explicitly click "Accept" to save
- Original content never modified automatically

### 2. **Warning Banner**
```
⚠️ AI-assisted output. Please verify before classroom use.
```

### 3. **Offline Queue**
- AI requests while offline are queued
- Processed automatically when connection returns
- Teachers notified when queued vs executed

### 4. **Analytics Tracking**
- All AI calls logged to `analytics` store
- Keys: `ai:simplify`, `ai:backcheck`, `ai:cultural_review`
- Helps evaluate which features teachers use most

### 5. **Output Length Limits**
- Telugu simplification: ≤25 words
- Definitions: ≤20 words
- Examples: ≤20 words
- Prevents verbose, unhelpful outputs

---

## Setup Instructions

### Local Development

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Start local dev server:**
```bash
cd telugu-reader
vercel dev
```
This runs the serverless function at `http://localhost:3000/api/ai`

3. **Open frontend:**
In another terminal:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`

### Production Deployment

1. **Deploy to Vercel:**
```bash
vercel
```

2. **Set environment variable:**
- Go to Vercel dashboard → Project → Settings → Environment Variables
- Add: `OPENAI_API_KEY` = `sk-proj-...`
- Redeploy

3. **Test AI features:**
- Visit your production URL
- Click any AI button
- Should work seamlessly

---

## Cost Estimate

**Model:** GPT-4o-mini
**Pricing:** ~$0.00015 per 1K input tokens, ~$0.0006 per 1K output tokens

**Per AI Call:**
- Simplify Telugu: ~200 tokens → $0.0002
- Back-check: ~300 tokens → $0.0003
- Cultural review: ~250 tokens → $0.00025

**For 100 teachers, each using 50 AI calls:**
- Total calls: 5,000
- Total cost: ~$1.25

**Extremely affordable for pilot study!**

---

## Evaluation Metrics

### For Your Paper/Report

**Quantitative:**
- Number of AI calls per teacher
- Which feature used most (simplify vs backcheck vs cultural)
- Cache hit rate (offline reuse)
- Fidelity scores for corpus

**Qualitative:**
- Teacher feedback on AI usefulness (Likert scale)
- Acceptance rate (how often teachers click "Accept")
- Examples of AI-improved content
- Teacher confidence in translation quality (before vs after back-check)

---

## Future Enhancements

### v2.0 (Optional)
1. **Dialectal Variant Generation**
   - Input: Standard Telugu term
   - Output: Coastal Andhra, Rayalaseema, Telangana variants

2. **Batch Processing**
   - Select 10 sentences → Run back-check on all
   - Generate quality report

3. **On-Device AI (Stretch Goal)**
   - Use WebAssembly + transformer.js
   - Fully offline AI (no API calls)
   - Larger models (IndicTrans2, NLLB)

4. **Teacher Training Mode**
   - Guided walkthrough of AI features
   - Example use cases
   - Best practices

---

## Troubleshooting

### "AI API error: 401 Unauthorized"
**Fix:** API key not set correctly
- Check `.env` file locally
- Check Vercel environment variables in production

### "Currently offline. Request queued."
**Expected behavior:** You're offline
- Request will process when online
- Check console: `Processing queued AI requests`

### "AI call failed: Failed to fetch"
**Fix:** Serverless function not running
- Local: Run `vercel dev`
- Production: Check Vercel logs

### Telugu text shows as boxes in AI results
**Fix:** Browser font support
- Use Chrome/Edge (best Telugu support)
- Install Telugu fonts system-wide

---

## Research Contribution

### For Your Proposal

This implementation demonstrates:

1. **Equity-Focused AI:** Helps teachers adapt content for diverse learners (reading levels, dialects, cultural contexts)

2. **Teacher Agency:** AI suggests, teachers decide (no black-box automation)

3. **Offline-First:** Caching ensures low-bandwidth schools can benefit

4. **Transparency:** All prompts documented, outputs explainable

5. **Scalability:** Serverless = zero infra management

### Quote for Paper:

> "To ensure equitable access, we implemented AI-assisted features that run only when online but cache results for offline reuse. Teachers can simplify Telugu text for struggling readers, verify translation fidelity through back-translation, and review cultural appropriateness—all while maintaining full control over content (Bender et al., 2021). This approach balances AI's efficiency with teacher expertise, crucial for marginalized-language contexts (Joshi et al., 2020)."

---

## Contact

**Issues/Questions:**
pmedidi3@gatech.edu

**Documentation:**
- Technical: This file
- User Guide: README.md
- API Docs: api/ai.js (inline comments)

---

**Last Updated:** January 2025
