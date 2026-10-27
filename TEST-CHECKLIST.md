# Test checklist

## A) Already run (during building, against a SIMULATED Supabase and with fake values)
- Build: correct domain in canonical / og:url / JSON-LD / robots.txt / sitemap.xml; no Netlify name left; secret key makes the build fail.
- JavaScript syntax of the whole page.
- Simulated flows (20 checks): public product load; visitor order/complaint/review reach the inbox once (no duplicates); visitors cannot read the inbox or write products; wrong password rejected; owner sees orders/complaints after login; review approval publishes and removes it from the inbox; order status change and delete are saved; image upload goes to Storage and deleted product images are removed after saving; logout clears customer data from the owner browser; failed sending shows a warning instead of silent success.

## B) You must test after deploying (real Supabase + Vercel)
1. `/config.js` contains only URL + public key.
2. Wrong owner password -> "Owner email ya password ghalat hai." Right password -> dashboard.
3. Not logged in: in the console, a write to `gw_store` / read of `gw_inbox` with the public key returns 401/403.
4. Owner: add / edit / delete a product; refresh; open in a private window - same data.
5. Owner: upload a product photo; check it loads in a private window; delete it.
6. If the panel offers to move old images to Storage, accept (after a backup).
7. Customer: place an order -> owner panel shows it (after login or within a minute). Order status change persists.
8. Customer: send a complaint -> owner sees it, replies -> customer sees the reply on the same device.
9. Customer: submit a review (rating 1-5) -> appears under "approval ka intezar" -> Approve -> visible to everyone.
10. Close the owner panel (x) -> must ask for email/password again.
11. Missing env vars: build prints a warning; owner login stays disabled (never a broken page).
12. Mobile + tablet layout; browser console has no errors; Network tab has no failed requests.
13. `/robots.txt`, `/sitemap.xml`, canonical URL show the production domain; `/LoginABEEHA` and `/about` open correctly.
14. Google Search Console: add the site, submit the sitemap. (Rankings are never guaranteed.)
