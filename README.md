# Glutawol Website (Netlify + Supabase ready)
Files: index.html (everything inside: CSS + JS), netlify.toml, robots.txt, sitemap.xml, supabase-setup.sql

## Netlify
Drag this whole folder to app.netlify.com > Add new site > Deploy manually. Then replace `www.glutawall.com` with your real domain in index.html, robots.txt, sitemap.xml.

## Supabase (optional, shares products/prices/rates/reviews/promos/site text across devices)
1. Create project, run supabase-setup.sql (put your email in it).
2. Authentication > Users > Add user (your owner email + password). Turn OFF public sign-ups.
3. Put Project URL + anon key in the "config.js" block inside index.html (search for GW_CONFIG). Never use the service_role key.
4. Owner panel then asks for email + password. First login uploads your current data to the cloud.
Orders, complaints and customer accounts stay in the visitor's browser (they contain phone numbers/passwords).

## SEO
Google Search Console > add site > submit /sitemap.xml.
