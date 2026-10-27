-- GLUTAWOL: safe to run on a project that already has gw_store (no data is deleted, nothing is dropped except policies, which are re-created).
-- BEFORE RUNNING: Table Editor > gw_store > Export data (backup).
-- 1) Mark your owner account (Authentication > Users > add user first; turn OFF public sign-ups):
--    update auth.users set raw_app_meta_data = coalesce(raw_app_meta_data,'{}'::jsonb) || '{"role":"owner"}' where email = 'OWNER_EMAIL_HERE';
--    (app_metadata cannot be edited by users, unlike email/user_metadata.) Owner must log out/in afterwards.
--    Run that line separately, with your real owner email, after the rest of this file.

-- ================= A) gw_store: products, rates, promos, owner reviews, site, content =================
create table if not exists gw_store(key text primary key, value jsonb not null, updated_at timestamptz default now());
alter table gw_store enable row level security;
drop policy if exists "public read" on gw_store; drop policy if exists "owner insert" on gw_store;
drop policy if exists "owner update" on gw_store; drop policy if exists "owner delete" on gw_store;
create policy "public read"  on gw_store for select using (key in ('products','rates','promos','reviews','site','content'));
create policy "owner insert" on gw_store for insert to authenticated with check ((auth.jwt()->'app_metadata'->>'role')='owner' and key in ('products','rates','promos','reviews','site','content'));
create policy "owner update" on gw_store for update to authenticated using ((auth.jwt()->'app_metadata'->>'role')='owner') with check ((auth.jwt()->'app_metadata'->>'role')='owner' and key in ('products','rates','promos','reviews','site','content'));
create policy "owner delete" on gw_store for delete to authenticated using ((auth.jwt()->'app_metadata'->>'role')='owner');

-- ================= B) gw_inbox: customer orders, complaints and review submissions =================
-- Visitors can only INSERT (they can never read anyone's order/complaint). Only the owner can read, edit and delete.
create table if not exists gw_inbox(
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('order','complaint','review')),
  ref text not null check (length(ref) between 1 and 80),
  data jsonb not null check (jsonb_typeof(data)='object' and pg_column_size(data) < 20000),
  created_at timestamptz not null default now(),
  unique (kind, ref)
);
alter table gw_inbox enable row level security;
revoke all on gw_inbox from anon;
grant insert on gw_inbox to anon;
grant select, insert, update, delete on gw_inbox to authenticated;
drop policy if exists "visitor insert" on gw_inbox; drop policy if exists "owner read" on gw_inbox;
drop policy if exists "owner update" on gw_inbox; drop policy if exists "owner delete" on gw_inbox;
create policy "visitor insert" on gw_inbox for insert to anon, authenticated
  with check (kind in ('order','complaint','review') and (kind <> 'review' or (data->>'rating') ~ '^[1-5]$'));
create policy "owner read"   on gw_inbox for select to authenticated using ((auth.jwt()->'app_metadata'->>'role')='owner');
create policy "owner update" on gw_inbox for update to authenticated using ((auth.jwt()->'app_metadata'->>'role')='owner') with check ((auth.jwt()->'app_metadata'->>'role')='owner');
create policy "owner delete" on gw_inbox for delete to authenticated using ((auth.jwt()->'app_metadata'->>'role')='owner');

-- A customer can see ONLY the status/reply of their own complaint, and only if they know both its ID and their phone number.
create or replace function gw_complaint_status(p_ref text, p_phone text)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object('status', data->>'status', 'reply', data->>'reply')
  from gw_inbox where kind='complaint' and ref = p_ref and data->>'phone' = p_phone limit 1
$$;
revoke all on function gw_complaint_status(text,text) from public;
grant execute on function gw_complaint_status(text,text) to anon, authenticated;

-- ================= C) Storage: product images =================
-- Public can view images by URL; only the owner can upload or delete. Max 2 MB, jpeg/png/webp.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images','product-images', true, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 2097152, allowed_mime_types = array['image/jpeg','image/png','image/webp'];
drop policy if exists "gw images owner read" on storage.objects; drop policy if exists "gw images owner insert" on storage.objects;
drop policy if exists "gw images owner update" on storage.objects; drop policy if exists "gw images owner delete" on storage.objects;
create policy "gw images owner read"   on storage.objects for select to authenticated using (bucket_id='product-images' and (auth.jwt()->'app_metadata'->>'role')='owner');
create policy "gw images owner insert" on storage.objects for insert to authenticated with check (bucket_id='product-images' and (auth.jwt()->'app_metadata'->>'role')='owner');
create policy "gw images owner update" on storage.objects for update to authenticated using (bucket_id='product-images' and (auth.jwt()->'app_metadata'->>'role')='owner');
create policy "gw images owner delete" on storage.objects for delete to authenticated using (bucket_id='product-images' and (auth.jwt()->'app_metadata'->>'role')='owner');

-- ROLLBACK for section A to the old email-based policies: drop the four gw_store policies and recreate them with
-- (auth.jwt()->>'email')='OWNER_EMAIL_HERE' (see git history of this file). Sections B and C only ADD objects; to undo: drop table gw_inbox;
