# Netlify Deploy

## Settings
- Build command: `npm run build`
- Publish directory: `dist`

## SPA Routing
This app uses React Router, so Netlify must rewrite all routes to `index.html`.

The required redirect is already in `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Notes
- The app is a static Vite build.
- PWA assets are generated during build and can be served by Netlify.
- If you use Supabase or other services, add the needed environment variables in the Netlify dashboard.
