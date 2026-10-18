// Dependency-free build: copies public files to dist/, writes dist/config.js from env vars,
// and sets the production domain in canonical/OG/robots/sitemap. Run: node scripts/build.mjs
import fs from 'node:fs';
if (fs.existsSync('.env')) for (const l of fs.readFileSync('.env','utf8').split(/\r?\n/)) {
  const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/); if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g,'');
}
const E = process.env, OLD = 'https://glutawoloffical.netlify.app';
const site = (E.SITE_URL || E.URL || OLD).replace(/\/+$/,'');   // Netlify provides URL automatically
const url = (E.SUPABASE_URL || '').trim(), key = (E.SUPABASE_PUBLISHABLE_KEY || E.SUPABASE_ANON_KEY || '').trim();
const secret = k => k.startsWith('sb_secret_') || (k.split('.')[1] && (()=>{try{return JSON.parse(Buffer.from(k.split('.')[1],'base64url')).role==='service_role'}catch{return false}})());
if (secret(key)) { console.error('ERROR: a secret/service_role key was supplied. Use ONLY the publishable/anon key.'); process.exit(1); }
if (url && !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)) { console.error('ERROR: SUPABASE_URL looks wrong.'); process.exit(1); }
if (!url || !key) console.warn('WARNING: Supabase vars missing - owner login will be disabled and data stays in browser storage.');
fs.rmSync('dist',{recursive:true,force:true}); fs.mkdirSync('dist');
fs.writeFileSync('dist/index.html', fs.readFileSync('index.html','utf8').split(OLD).join(site));
fs.writeFileSync('dist/config.js', `window.GW_CONFIG=${JSON.stringify({SUPABASE_URL:url,SUPABASE_ANON_KEY:key,TABLE:'gw_store'})};\n`);
fs.writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /LoginABEEHA\nSitemap: ${site}/sitemap.xml\n`);
fs.writeFileSync('dist/sitemap.xml', fs.readFileSync('sitemap.xml','utf8').split(OLD).join(site));
console.log('Built dist/ for', site);
