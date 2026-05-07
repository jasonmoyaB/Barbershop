# Testing PWA Functionality

This app is now a fully functional Progressive Web App (PWA).

## How to Test

### 1. Build and Preview

```bash
npm run build
npm run preview
```

The app will be available at http://localhost:4173

### 2. Test Installation

#### On Desktop (Chrome/Edge)

1. Open http://localhost:4173
2. Look for an install icon (➕ or ⬇) in the address bar
3. Click to install the app
4. The app will open in a standalone window

#### On Mobile (Android Chrome/iOS Safari)

1. Open http://localhost:4173
2. Tap the browser menu (⋮ or share icon)
3. Select "Add to Home Screen"
4. The app icon will appear on your home screen

### 3. Test Offline Functionality

1. Open http://localhost:4173 in Chrome
2. Open DevTools (F12)
3. Go to **Application** tab
4. Under **Service Workers**, verify the SW is registered and running
5. Under **Network** tab, check the **Offline** checkbox
6. Try navigating — you should see the minimalist "Sin conexión" page
7. Uncheck **Offline** and click "Reintentar" to restore connection

### 4. Test Caching

1. Open http://localhost:4173
2. Navigate around the site
3. Open DevTools → Application → Cache Storage
4. You should see multiple caches:
   - `workbox-precache-*` (static assets)
   - `google-fonts-cache` (fonts)
   - `offline-cache` (offline fallback)
5. Refresh the page — it should load instantly from cache

## PWA Features Implemented

✅ Installable on mobile and desktop  
✅ Works offline with graceful fallback  
✅ Caches static assets for fast loading  
✅ Auto-updates when new version is deployed  
✅ Standalone mode (no browser UI)  
✅ Themed status bar (#0a0a0a)  
✅ Custom offline page (minimalist design)

## Production Considerations

### Icons

Currently using `favicon.svg` for all icon sizes. For production:

1. Generate PNG icons (192x192 and 512x512):
   - Use https://realfavicongenerator.net
   - Or convert `public/icon-source.svg` to PNG
2. Update `vite.config.ts` manifest.icons to point to PNG files

### Deployment

When deploying to production:

- Service worker will auto-update users when you deploy new versions
- Users will see the new version on next page load
- No manual intervention required

### Testing on Real Devices

1. Deploy to a public URL (Vercel, Netlify, etc.)
2. Visit the URL on your mobile device
3. Install the PWA
4. Test offline by enabling airplane mode

## Troubleshooting

**SW not registering?**
- Check browser console for errors
- Ensure you're using HTTPS (or localhost)
- Clear browser cache and reload

**Offline page not showing?**
- Verify `offline.html` is in `public/` folder
- Check DevTools → Application → Cache Storage for `offline-cache`
- Make sure network is truly offline (not just slow)

**Install prompt not appearing?**
- PWA install criteria must be met (HTTPS, manifest, SW)
- Some browsers hide the prompt after it's been dismissed
- On mobile, use the browser menu to manually add to home screen
