-- ============================================================
-- Calculator Cusut - Schema init (run in Supabase -> SQL Editor)
-- ============================================================

-- ---------- work_entries ----------
create table if not exists public.work_entries (
  id              uuid primary key default gen_random_uuid(),
  model_name      text not null,
  operation_name  text not null,
  cost_per_piece  decimal(10,2) not null,
  quantity        integer not null,
  total_earned    decimal(10,2) generated always as (cost_per_piece * quantity) stored,
  work_date       date not null default current_date,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- keep updated_at fresh on every row update
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_work_entries_updated_at on public.work_entries;
create trigger trg_work_entries_updated_at
  before update on public.work_entries
  for each row execute function public.set_updated_at();

-- ---------- templates ----------
create table if not exists public.templates (
  id              uuid primary key default gen_random_uuid(),
  model_name      text not null,
  operation_name  text not null,
  cost_per_piece  decimal(10,2) not null,
  created_at      timestamptz default now(),
  unique (model_name, operation_name, cost_per_piece)
);

-- ---------- RLS: public access (no auth) ----------
alter table public.work_entries enable row level security;
alter table public.templates   enable row level security;

drop policy if exists "public_all_work_entries" on public.work_entries;
create policy "public_all_work_entries"
  on public.work_entries for all
  using (true) with check (true);

drop policy if exists "public_all_templates" on public.templates;
create policy "public_all_templates"
  on public.templates for all
  using (true) with check (true);

-- ---------- Real-time ----------
do $$
begin
  if not exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    create publication supabase_realtime;
  end if;
end $$;

alter publication supabase_realtime add table public.work_entries;

-- ---------- Reload PostgREST schema cache ----------
notify pgrst, 'reload schema';
