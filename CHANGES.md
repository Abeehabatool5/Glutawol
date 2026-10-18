Changed: index.html (fixed syntax error in config block that disabled Supabase; config now from /config.js; removed hardcoded owner password 123456789 and localStorage gw_pass; owner login requires Supabase Auth; customer passwords hashed, legacy plaintext migrated at login), netlify.toml (build/publish dist, HSTS, CSP report-only, noindex for owner link), supabase-setup.sql (role-based owner policies, key allowlist, idempotent), README.md.
Added: scripts/build.mjs, package.json, .env.example, .gitignore (replaces upload named _gitignore), CHANGES.md.
Generated at build: dist/config.js, robots.txt (Disallow /LoginABEEHA), sitemap.xml, index.html with domain set.
Removed: nothing.
