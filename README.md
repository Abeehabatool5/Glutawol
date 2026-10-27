# Glutawol Website (Vercel + Supabase)
Plain HTML site (`index.html`) plus a tiny dependency-free build (`scripts/build.mjs`) that writes `dist/` (public config, robots.txt, sitemap.xml, your domain).

## Public vs secret
- PUBLIC (goes to the browser, protected by RLS): `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` (or legacy anon key).
- SECRET: any `service_role` / `sb_secret_...` key. Never use it here; the build stops if it sees one. Never commit `.env`.

## Where data lives (Supabase)
| Data | Where | Who can read | Who can write |
|---|---|---|---|
| Products, prices, rates, promos, published reviews, site text | table `gw_store` | everyone | owner only |
| Orders, complaints, new customer reviews | table `gw_inbox` | owner only | visitors may only add (insert) |
| Product photos | Storage bucket `product-images` | everyone (by URL) | owner only |
| Customer accounts (login/signup) | still in each visitor's browser | - | - |

## 1. Supabase (once)
1. Backup first: Table Editor > `gw_store` > Export.
2. Project Settings > API: copy Project URL and the publishable key (for Vercel).
3. Authentication > Users > Add user (owner email + strong password). Authentication > Providers > Email: turn OFF public sign-ups.
4. SQL Editor: paste and run the whole `supabase-setup.sql`. Then run its `update auth.users ...` line (remove the leading `--`) with your owner email. Owner must log out/in afterwards.

## 2. Local test
`cp .env.example .env`, fill the values, `node scripts/build.mjs`, serve `dist/` (e.g. `npx serve dist`).

## 3. Vercel
1. Vercel > Add New > Project > import the existing GitHub repo.
2. Framework Preset: Other. Build Command `node scripts/build.mjs`, Output Directory `dist` (also in `vercel.json`).
3. Environment Variables: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, optional `SITE_URL`.
4. Deploy and test on the `.vercel.app` URL (see `TEST-CHECKLIST.md`).
5. Custom domain: Settings > Domains > Add, set the DNS records Vercel shows, then set `SITE_URL` (e.g. `https://yourdomain.pk`) and Redeploy.
6. Supabase > Authentication > URL Configuration: add the Vercel / custom domain.

## 4. Rollback
Vercel > Deployments > pick an older working deployment > Promote to Production.

## Known limitations
- Customer accounts and the customer's cart stay in their own browser. Customer sign-in is a local gate (salted PBKDF2 hashes), not real account security.
- Spam: anyone can send orders/complaints/reviews (size and rating are checked in the database, but there is no rate limit). Reviews are only published after the owner approves them.
- Promo codes are readable by the public (applied in the browser).
- Tailwind loads from its CDN (slower); replacing it needs a Tailwind CLI build.
- Not tested against a live Supabase project or Vercel (no network/credentials where this was built); logic was tested against a simulated Supabase only.
