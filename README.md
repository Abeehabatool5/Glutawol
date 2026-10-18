# Glutawol Website (Netlify + Supabase)
Plain HTML site (`index.html`) plus a tiny dependency-free build (`scripts/build.mjs`) that injects public config and your domain.

## What is public vs secret
- PUBLIC (goes to the browser, protected by RLS, not a secret): `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` (or legacy anon key).
- SECRET: any `service_role` / `sb_secret_...` key. Never use it here; the build stops if it sees one.

## 1. Supabase (once)
1. Dashboard > Project Settings > API: copy Project URL and the publishable (anon) key.
2. Authentication > Users > Add user (owner email + strong password). Authentication > Providers > Email: turn OFF public sign-ups.
3. SQL Editor: run `supabase-setup.sql` (it does not delete data). Run its step-1 `update auth.users ...` line with your owner email, then log in again.

## 2. Local test
`cp .env.example .env`, fill the two values, then `node scripts/build.mjs` and serve the `dist/` folder (e.g. `npx serve dist`).

## 3. Netlify
Connect the GitHub repo. Build command and publish dir come from `netlify.toml` (`node scripts/build.mjs`, `dist`). Site settings > Environment variables: add `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`. `SITE_URL` is optional (custom domain); otherwise Netlify's own URL is used for canonical/OG/robots/sitemap. Deploy.

## 4. Verify after deploy
- Open `/config.js`: only URL + public key, nothing else.
- Logged out, in the browser console, try writing to `gw_store` with the anon key: must return 401/403.
- Owner login at `/LoginABEEHA`: add/edit/delete a product, reload in a private window.
- `/robots.txt`, `/sitemap.xml` show your real domain. Submit sitemap in Google Search Console.
- Browser console: check for Content-Security-Policy-Report-Only warnings, then rename it to `Content-Security-Policy` in `netlify.toml`.

## Known limitations
- Orders, complaints, reviews and customer accounts still live in each visitor's browser (original design). The owner cannot see other visitors' orders/complaints. Moving them to Supabase tables with insert-only public policies is the recommended next step.
- Customer sign-in is a local gate only (passwords are now salted PBKDF2 hashes, not plaintext) - it is not real account security.
- Promo codes are readable by the public (they are applied in the browser).
- Tailwind is loaded from its CDN (not ideal for speed); replacing it needs a Tailwind CLI build.
- Not tested against a live Supabase project or Netlify (no network/credentials here).
