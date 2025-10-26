# Quick Start Guide

## Run Locally (3 Steps)

1. **Open terminal in project folder**
   ```bash
   cd telugu-reader
   ```

2. **Start server** (choose one):
   ```bash
   # Python
   python -m http.server 8000

   # Node.js
   npx serve

   # PHP
   php -S localhost:8000
   ```

3. **Open browser**
   ```
   http://localhost:8000
   ```

## Test Offline Mode

1. Open DevTools (F12)
2. Go to **Application** → **Service Workers**
3. Check **Offline** box
4. Reload page → Should still work!

## Deploy to Vercel (2 Commands)

```bash
npm i -g vercel
vercel
```

Follow prompts → Get live URL instantly!

## Features to Test

- ✅ Click "Primary: English" to toggle language
- ✅ Click any blue underlined term (e.g., "conduction")
- ✅ Submit feedback via form
- ✅ Click "Download Feedback" to export JSON
- ✅ Check "Top Terms" analytics after clicking 3+ terms
- ✅ Go offline and reload (should work!)
- ✅ Press Tab to navigate, Enter to activate, Esc to close panel

## Project Files

```
telugu-reader/
├── index.html              ← Main page
├── styles.css              ← All styling
├── app.js                  ← Logic + IndexedDB
├── sw.js                   ← Service Worker (offline)
├── manifest.webmanifest    ← PWA config
├── vercel.json             ← Deploy config
├── README.md               ← Full documentation
├── data/
│   ├── sentences.json      ← 18 bilingual sentences
│   └── glossary.json       ← 12 terms with definitions
└── assets/
    ├── icon-192.png        ← App icon
    └── icon-512.png        ← App icon (large)
```

## Troubleshooting

**Service Worker not registering?**
- Must use `localhost` or HTTPS (not `file://`)
- Check DevTools Console for errors

**Offline mode not working?**
- Ensure Service Worker is active (DevTools → Application)
- Try hard refresh (Ctrl+Shift+R)

**Telugu text not displaying?**
- Install Telugu fonts if needed
- Modern browsers should support it by default

## Next Steps

1. Add more sentences to `data/sentences.json`
2. Add more terms to `data/glossary.json`
3. Customize colors in `styles.css` (`:root` variables)
4. Deploy to Vercel for public access

---

**Questions?** Check README.md for detailed documentation.
