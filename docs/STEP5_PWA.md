# Step 5: PWA + Offline Support

## Files Created

| File | Purpose |
|------|---------|
| `public/manifest.json` | Web app manifest for installability |
| `public/sw.js` | Service worker for caching & offline |
| `src/app/offline/page.tsx` | Offline fallback page |
| `src/app/layout.tsx` | Root layout with PWA meta tags |
| `src/components/InstallPrompt.tsx` | "Add to home screen" prompt |
| `src/components/ServiceWorkerRegistration.tsx` | SW registration |

## PWA Features

### Installable
- Web manifest with name, icons, theme colors
- Install prompt appears after 30 seconds
- Works on Android Chrome, iOS Safari, desktop browsers

### Offline Capable
- Service worker caches key routes
- Offline fallback page when network unavailable
- Cache-first strategy for static assets

### App-like Experience
- Standalone display mode (no browser UI)
- Custom status bar color
- Splash screen on iOS

## Manifest Configuration

| Property | Value |
|----------|-------|
| `name` | SpendWise |
| `theme_color` | #34d399 (emerald) |
| `background_color` | #0f0a1a (dark purple) |
| `display` | standalone |
| `start_url` | /dashboard |

## Service Worker Strategies

| Request Type | Strategy |
|--------------|----------|
| Navigation (pages) | Network-first, offline fallback |
| Static assets | Cache-first |
| Supabase API | Network-only (bypass cache) |

## Testing PWA

### In Development
Service worker only registers in production. To test:
1. Run `npm run build`
2. Run `npm start`
3. Open Chrome DevTools → Application → Service Workers

### Testing Install
1. Open site in Chrome/Edge
2. Wait 30 seconds for prompt (or use DevTools)
3. Click "Install"
4. App appears on desktop/home screen

### Testing Offline
1. Install the app
2. DevTools → Network → Set to "Offline"
3. Reload page
4. Should see offline fallback page

## Icons Required

The manifest references these icons that need to be created:
- `public/icons/icon-192.png` (192x192)
- `public/icons/icon-512.png` (512x512)

Use a square logo with the SpendWise branding (emerald/cyan gradient dollar sign on dark background).

---

## MVP Complete! 🎉

All 5 steps have been implemented:

1. ✅ Supabase Backend Foundation
2. ✅ Auth Flow (Magic Link)
3. ✅ Quick-add Transaction UI
4. ✅ Weekly Summary Logic
5. ✅ PWA + Offline Support

### Next Steps (Future Roadmap)
- [ ] SMS parsing for transaction import
- [ ] Receipt photo scanning (OCR)
- [ ] CSV bank statement import
- [ ] Push notifications for daily prompts
- [ ] Budget alerts when approaching limits
