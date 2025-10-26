# Deployment Guide

## Pre-Deployment Checklist

- [x] All files created and validated
- [x] Icons generated (192x192, 512x512)
- [x] Data files populated (sentences, glossary)
- [x] Service Worker configured
- [x] Manifest file complete
- [x] Vercel config ready
- [x] Documentation complete

## Option 1: Vercel (Recommended) ⚡

**Fastest deployment - 2 commands:**

```bash
# 1. Install Vercel CLI (one-time)
npm install -g vercel

# 2. Deploy
cd telugu-reader
vercel
```

**Follow prompts:**
- Login/signup
- Create new project or link existing
- Accept defaults
- Get live URL instantly!

**Custom domain (optional):**
```bash
vercel --prod
vercel domains add yourname.com
```

---

## Option 2: GitHub Pages 🐙

**Steps:**

1. **Create GitHub repo**
   ```bash
   cd telugu-reader
   git init
   git add .
   git commit -m "Initial commit: Telugu Reader MVP"
   ```

2. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/telugu-reader.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable Pages**
   - Go to repo → Settings → Pages
   - Source: Deploy from branch
   - Branch: main, folder: / (root)
   - Save

4. **Access**
   - URL: `https://yourusername.github.io/telugu-reader/`
   - Wait 2-3 minutes for first deployment

**Note:** GitHub Pages uses HTTPS by default (required for Service Worker)

---

## Option 3: Netlify 🌐

**Method A: Drag & Drop**
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag `telugu-reader` folder
3. Wait 30 seconds
4. Get live URL!

**Method B: CLI**
```bash
npm install -g netlify-cli
cd telugu-reader
netlify deploy
netlify deploy --prod
```

**Method C: Git Integration**
1. Push to GitHub (see Option 2)
2. Go to [app.netlify.com](https://app.netlify.com)
3. New site from Git
4. Connect repo
5. Deploy settings: None needed (static site)
6. Deploy!

---

## Option 4: Firebase Hosting 🔥

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialize
cd telugu-reader
firebase init hosting

# Answer prompts:
# - Create new project or select existing
# - Public directory: . (current folder)
# - Configure as SPA: No
# - Set up automatic builds: No
# - Overwrite index.html: No

# 4. Deploy
firebase deploy --only hosting
```

**URL:** `https://yourproject.web.app`

---

## Option 5: AWS S3 + CloudFront ☁️

**1. Create S3 bucket**
```bash
aws s3 mb s3://telugu-reader-yourname
```

**2. Upload files**
```bash
cd telugu-reader
aws s3 sync . s3://telugu-reader-yourname --acl public-read
```

**3. Enable static hosting**
```bash
aws s3 website s3://telugu-reader-yourname \
  --index-document index.html \
  --error-document index.html
```

**4. (Optional) Add CloudFront for HTTPS**
- Create CloudFront distribution
- Origin: S3 bucket
- SSL certificate: Use default or custom

---

## Option 6: DigitalOcean App Platform 🌊

1. Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. Create → Apps
3. Connect GitHub repo
4. Detect static site automatically
5. Deploy (free tier available)

---

## Option 7: Cloudflare Pages ⚡

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Pages → Create a project
3. Connect Git repository
4. Build settings: None (static)
5. Deploy

**Benefits:**
- Free unlimited bandwidth
- Global CDN
- Auto HTTPS

---

## Post-Deployment Verification

### 1. Basic Functionality
- [ ] Site loads without errors
- [ ] 18 sentence pairs display
- [ ] Language toggle works
- [ ] Glossary terms clickable
- [ ] Panel opens/closes

### 2. Service Worker
- [ ] Open DevTools → Application
- [ ] Service Worker shows as "activated"
- [ ] Check offline box
- [ ] Hard reload (Ctrl+Shift+R)
- [ ] Site still works!

### 3. PWA Install
- [ ] Chrome: Install button appears in address bar
- [ ] Install app
- [ ] Launch from desktop/home screen
- [ ] Works standalone

### 4. Performance
- [ ] Run Lighthouse audit
- [ ] Performance: 90+
- [ ] Accessibility: 100
- [ ] PWA: 90+

### 5. Mobile Test
- [ ] Open on mobile device
- [ ] Responsive layout works
- [ ] Touch interactions smooth
- [ ] Install as PWA
- [ ] Offline mode works

---

## Troubleshooting

### Service Worker not registering
**Issue:** SW shows "error" in DevTools

**Fix:**
- Ensure HTTPS or localhost
- Check browser console for errors
- Verify all files in `PRECACHE_URLS` exist
- Clear site data and retry

### Icons not showing
**Issue:** PWA icons missing

**Fix:**
- Verify `icon-192.png` and `icon-512.png` exist in `/assets/`
- Check manifest.webmanifest paths are correct
- Hard refresh (Ctrl+Shift+R)

### Data not loading
**Issue:** Blank page or missing sentences

**Fix:**
- Open browser console
- Check for 404 errors on JSON files
- Verify `/data/sentences.json` and `/data/glossary.json` accessible
- Check JSON syntax is valid

### Offline mode not working
**Issue:** Page won't load offline

**Fix:**
- Load page while online first
- Wait for SW to activate (check DevTools)
- Try hard reload
- Clear cache and reload while online

---

## Environment-Specific Notes

### Vercel
- Auto-adds HTTPS
- Auto-applies `vercel.json` headers
- Edge network (fast globally)
- Automatic deployments on git push

### GitHub Pages
- HTTPS automatic
- May take 2-3 min for first deploy
- Updates within 1 min
- Custom domain supported (CNAME)

### Netlify
- HTTPS automatic
- Instant cache invalidation
- Form handling available
- Serverless functions available

---

## Custom Domain Setup

### Vercel
```bash
vercel domains add yourdomain.com
# Follow DNS instructions
```

### Netlify
1. Site settings → Domain management
2. Add custom domain
3. Update DNS records (A or CNAME)
4. SSL auto-provisions

### Cloudflare Pages
1. Custom domains → Add
2. Enter domain
3. Update nameservers to Cloudflare
4. SSL automatic

---

## Monitoring & Analytics (Optional)

### Add Google Analytics
Insert before `</head>` in index.html:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Add Plausible Analytics (Privacy-friendly)
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

---

## Continuous Deployment

### Auto-deploy on Git push

**Vercel:**
```bash
vercel --prod
# Links repo, auto-deploys on push
```

**Netlify:**
- Connect GitHub repo in dashboard
- Auto-deploys on push to main

**GitHub Actions** (for any host):
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## Security Headers (Production Best Practices)

Add to `vercel.json` (or equivalent):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## Cost Estimate

| Platform | Free Tier | Bandwidth | Storage |
|----------|-----------|-----------|---------|
| Vercel | ✅ Yes | 100 GB/mo | Unlimited |
| Netlify | ✅ Yes | 100 GB/mo | Unlimited |
| GitHub Pages | ✅ Yes | 100 GB/mo | 1 GB |
| Firebase | ✅ Yes | 10 GB/mo | 1 GB |
| Cloudflare | ✅ Yes | Unlimited | Unlimited |

**All free tiers include:**
- HTTPS/SSL
- CDN
- Auto-scaling
- More than enough for 1000s of users

---

## 🚀 Quick Deploy Commands

**Vercel (fastest):**
```bash
cd telugu-reader && npx vercel
```

**Netlify:**
```bash
cd telugu-reader && npx netlify-cli deploy --prod
```

**GitHub Pages:**
```bash
cd telugu-reader
git init && git add . && git commit -m "Deploy"
git remote add origin <your-repo-url>
git push -u origin main
# Then enable Pages in repo settings
```

---

## ✅ You're Ready!

Pick any deployment option above and your Telugu Reader will be live in minutes.

**Recommended for beginners:** Vercel or Netlify
**Recommended for GitHub users:** GitHub Pages
**Recommended for scale:** Cloudflare Pages

**Questions?** Check [README.md](README.md) or [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
