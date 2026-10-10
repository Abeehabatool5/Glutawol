-- Run once in Supabase > SQL Editor. Replace OWNER_EMAIL_HERE with your owner login email.
create table if not exists gw_store(key text primary key, value jsonb not null, updated_at timestamptz default now());
alter table gw_store enable row level security;
create policy "public read"  on gw_store for select using (true);
create policy "owner insert" on gw_store for insert to authenticated with check ((auth.jwt()->>'email')='OWNER_EMAIL_HERE');
create policy "owner update" on gw_store for update to authenticated using ((auth.jwt()->>'email')='OWNER_EMAIL_HERE') with check ((auth.jwt()->>'email')='OWNER_EMAIL_HERE');
create policy "owner delete" on gw_store for delete to authenticated using ((auth.jwt()->>'email')='OWNER_EMAIL_HERE');
