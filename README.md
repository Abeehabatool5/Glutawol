# Glutawol Skincare Website

## Folder structure
- `index.html` — website layout and Tailwind utility styling
- `css/style.css` — fallback styles and animations
- `js/app.js` — website interactions and current browser-storage logic
- `netlify.toml` — Netlify routing for the owner login path

## Run locally
Open `index.html` in a browser. An internet connection is needed for the Tailwind CDN and remote product images.

## Publish with GitHub Pages
1. Upload the contents of this folder to the root of your GitHub repository.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.

## Owner route
The configured private entry path is `/LoginABEEHA`. The existing site uses browser `localStorage`; this is not secure server-side authentication and data is not shared between devices. For a production site, connect a backend such as Supabase and use server-side authorization. Do not treat the demo password stored in browser code/storage as secure.
