# Quick Start Guide

## Run Locally (5 Steps)

1. **Extract the .zip file and open terminal in project folder**
   ```bash
   cd telugu-reader
   ```

2. **Install Node.js** (if not already installed)
   - Download from [nodejs.org](https://nodejs.org)
   - Verify installation: `node --version`

3. **Create `.env` file with your OpenAI API key**

   Create a file named `.env` in the project root with this content:
   ```
   OPENAI_API_KEY=your-key-here
   ```
   Replace `your-key-here` with your actual OpenAI API key.

   **Important:** Don't share this file or commit it to version control!

4. **Start Vercel dev server** (required for AI features)
   ```bash
   npx vercel dev
   ```
   - First time: Follow prompts to link project (or skip with `vercel dev --yes`)
   - This runs the serverless API endpoint locally

5. **Open browser**
   ```
   http://localhost:3000
   ```
   (Or whatever port Vercel dev shows)

## View Live Production Version (No Setup)

Just visit: **https://telugu-reader.vercel.app**

No installation needed! All features work including AI.

## Test Offline Mode

1. Open DevTools (F12)
2. Go to **Application** → **Service Workers**
3. Check **Offline** box
4. Reload page → Should still work!

## Deploy to Vercel (3 Steps)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Add OpenAI API key to Vercel**
   - Go to your project on vercel.com
   - Settings → Environment Variables
   - Add `OPENAI_API_KEY` with your key
   - Select all environments (Production, Preview, Development)

3. **Deploy**
   ```bash
   vercel --prod
   ```
   Or just push to GitHub (auto-deploys if connected)

## Features to Test

- ✅ Click "Primary: English" to toggle language
- ✅ Click any blue underlined term (e.g., "conduction")
- ✅ Click "🪄 Simplify" to simplify Telugu text with AI
- ✅ Save simplified version and view it later (session only)
- ✅ Submit feedback via form
- ✅ Click "Download Feedback" to export JSON
- ✅ Check "Top Terms" analytics after clicking 3+ terms
- ✅ Lazy loading (20 sentences at a time, scroll for more)
- ✅ Go offline and reload (should work!)
- ✅ Press Tab to navigate, Enter to activate, Esc to close panel

## Project Files

```
telugu-reader/
├── index.html              ← Main page
├── styles.css              ← All styling
├── app.js                  ← Logic + data loading
├── ai-helpers.js           ← AI feature handlers
├── sw.js                   ← Service Worker (offline)
├── manifest.webmanifest    ← PWA config
├── vercel.json             ← Deploy config
├── package.json            ← Dependencies
├── .env                    ← API keys (DO NOT COMMIT)
├── README.md               ← Full documentation
├── api/
│   └── ai.js               ← Serverless function for OpenAI
├── data/
│   ├── sentences.json      ← 771 bilingual sentences
│   └── glossary.json       ← 405 terms with definitions
└── assets/
    ├── icon-192.png        ← App icon
    └── icon-512.png        ← App icon (large)
```

## Troubleshooting

**AI features not working locally?**
- Make sure you're using `vercel dev` (not a simple HTTP server)
- Check that `.env` file exists with valid `OPENAI_API_KEY`
- Check browser Console for errors

**AI features not working in production?**
- Ensure `OPENAI_API_KEY` is set in Vercel dashboard
- Redeploy after adding environment variable
- Check Runtime Logs in Vercel dashboard

**Service Worker not registering?**
- Must use `localhost` or HTTPS (not `file://`)
- Check DevTools Console for errors

**Offline mode not working?**
- Ensure Service Worker is active (DevTools → Application)
- Try hard refresh (Ctrl+Shift+R)

**Page loading old version?**
- Clear site data: F12 → Application → Clear storage
- Hard refresh (Ctrl+Shift+R)

**Telugu text not displaying?**
- Modern browsers should support it by default
- Install Telugu fonts if needed

## Next Steps

1. Add more sentences to `data/sentences.json`
2. Add more terms to `data/glossary.json`
3. Customize colors in `styles.css` (`:root` variables)
4. Deploy to Vercel for public access

---

**Questions?** Check README.md for detailed documentation.
