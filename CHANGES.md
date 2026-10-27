Vercel + Supabase package (complete).
Added: vercel.json (build, output dir, /LoginABEEHA and /about rewrites, security headers); TEST-CHECKLIST.md.
Changed:
- supabase-setup.sql: gw_store policies kept; ADDED gw_inbox (orders, complaints, customer reviews: visitors insert-only, owner-only read), gw_complaint_status() (customer sees only status/reply of own complaint), Storage bucket product-images (owner-only upload/delete).
- index.html: orders/complaints/reviews go to Supabase; customer reviews need owner approval; product photos go to Storage (old base64 photos can be moved with one confirm); owner session cleared on panel close/logout and customer data removed from the owner browser; owner login and saving blocked until cloud data has loaded; visible warning if an order/complaint/review could not be sent; SEO: shorter meta description, new title, og/twitter tags, image alt text, crawlable internal links (/ and /about).
- scripts/build.mjs: detects Vercel production URL; replaces old Netlify domain everywhere incl. footer text.
- package.json, .gitignore, .env.example, README.md, robots.txt.
Unchanged: design, theme, owner panel layout, /LoginABEEHA link, sitemap.xml (build rewrites the domain), netlify.toml (kept in your repo until Vercel is verified; not in this zip).
Not included on purpose: .env (real values never go in a zip or GitHub).
