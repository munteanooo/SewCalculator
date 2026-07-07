-- ============================================================
-- Calculator Cusut - Auth & multi-user isolation
-- Run AFTER 0001_init.sql in Supabase -> SQL Editor
-- ============================================================

-- ---------- Add owner column ----------
alter table public.work_entries
  add column if not exists user_id uuid references auth.users(id) default auth.uid();

alter table public.templates
  add column if not exists user_id uuid references auth.users(id) default auth.uid();

-- Orphan rows (created before auth) keep user_id = null and become
-- invisible to everyone via RLS. Remove them if you want a clean slate:
--   delete from public.work_entries where user_id is null;
--   delete from public.templates  where user_id is null;

-- ---------- Replace public policies with per-user ones ----------
drop policy if exists "public_all_work_entries" on public.work_entries;
drop policy if exists "public_all_templates"   on public.templates;

create policy "own_work_entries"
  on public.work_entries
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own_templates"
  on public.templates
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------- Real-time already enabled on work_entries ----------
-- (see 0001_init.sql). RLS scopes the broadcast to the owner.

-- ---------- Reload PostgREST schema cache ----------
notify pgrst, 'reload schema';
