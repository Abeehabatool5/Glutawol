-- GLUTAWOL: safe to run on a project that already has gw_store (no data is deleted).
-- 1) Mark your owner account (Authentication > Users > add user first; turn OFF public sign-ups):
--    update auth.users set raw_app_meta_data = coalesce(raw_app_meta_data,'{}'::jsonb) || '{"role":"owner"}' where email = 'OWNER_EMAIL_HERE';
--    (app_metadata cannot be edited by users, unlike email/user_metadata.) Owner must log out/in afterwards.
create table if not exists gw_store(key text primary key, value jsonb not null, updated_at timestamptz default now());
alter table gw_store enable row level security;
drop policy if exists "public read" on gw_store; drop policy if exists "owner insert" on gw_store;
drop policy if exists "owner update" on gw_store; drop policy if exists "owner delete" on gw_store;
create policy "public read"  on gw_store for select using (key in ('products','rates','promos','reviews','site','content'));
create policy "owner insert" on gw_store for insert to authenticated with check ((auth.jwt()->'app_metadata'->>'role')='owner' and key in ('products','rates','promos','reviews','site','content'));
create policy "owner update" on gw_store for update to authenticated using ((auth.jwt()->'app_metadata'->>'role')='owner') with check ((auth.jwt()->'app_metadata'->>'role')='owner' and key in ('products','rates','promos','reviews','site','content'));
create policy "owner delete" on gw_store for delete to authenticated using ((auth.jwt()->'app_metadata'->>'role')='owner');
-- ROLLBACK to the previous email-based policies: drop the four policies above and recreate them with
-- (auth.jwt()->>'email')='OWNER_EMAIL_HERE' (see git history of this file).
