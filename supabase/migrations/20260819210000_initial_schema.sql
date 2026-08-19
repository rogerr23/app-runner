-- App Runner initial domain model.
-- Authorization is enforced in PostgreSQL so every API consumer receives the
-- same protection, regardless of the calling client.

create type public.experience_level as enum (
  'beginner',
  'intermediate',
  'advanced'
);

create type public.primary_goal as enum (
  'start_running',
  'run_5k',
  'run_10k',
  'run_half_marathon',
  'run_marathon',
  'improve_pace',
  'stay_active'
);

create type public.run_type as enum (
  'easy',
  'long',
  'interval',
  'tempo',
  'recovery',
  'walk_run',
  'race',
  'other'
);

create type public.plan_status as enum (
  'planned',
  'completed',
  'cancelled'
);

create type public.goal_kind as enum (
  'weekly_distance',
  'weekly_frequency',
  'event_distance',
  'target_pace'
);

create type public.goal_status as enum (
  'active',
  'completed',
  'cancelled'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 80),
  experience_level public.experience_level not null default 'beginner',
  primary_goal public.primary_goal not null default 'start_running',
  weekly_goal_km numeric(6, 2) check (weekly_goal_km > 0 and weekly_goal_km <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.planned_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  scheduled_for date not null,
  run_type public.run_type not null default 'easy',
  target_distance_km numeric(6, 2)
    check (target_distance_km > 0 and target_distance_km <= 500),
  target_duration_seconds integer
    check (target_duration_seconds > 0 and target_duration_seconds <= 86400),
  notes text check (char_length(notes) <= 1000),
  status public.plan_status not null default 'planned',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint planned_run_has_target check (
    target_distance_km is not null or target_duration_seconds is not null
  )
);

create table public.runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  planned_run_id uuid unique references public.planned_runs (id) on delete set null,
  performed_at timestamptz not null,
  run_type public.run_type not null default 'easy',
  distance_km numeric(6, 2) not null
    check (distance_km > 0 and distance_km <= 500),
  duration_seconds integer not null
    check (duration_seconds > 0 and duration_seconds <= 86400),
  pace_seconds_per_km numeric(8, 2)
    generated always as (duration_seconds / distance_km) stored,
  perceived_effort smallint check (perceived_effort between 1 and 5),
  notes text check (char_length(notes) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind public.goal_kind not null,
  title text not null check (char_length(title) between 2 and 100),
  target_value numeric(8, 2) not null check (target_value > 0),
  unit text not null check (unit in ('km', 'runs', 'seconds_per_km')),
  starts_on date not null default current_date,
  deadline date,
  status public.goal_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint goal_deadline_is_valid check (
    deadline is null or deadline >= starts_on
  )
);

create index planned_runs_user_date_idx
  on public.planned_runs (user_id, scheduled_for desc);
create index runs_user_performed_at_idx
  on public.runs (user_id, performed_at desc);
create index goals_user_status_idx
  on public.goals (user_id, status);

create function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger planned_runs_set_updated_at
before update on public.planned_runs
for each row execute function public.set_updated_at();

create trigger runs_set_updated_at
before update on public.runs
for each row execute function public.set_updated_at();

create trigger goals_set_updated_at
before update on public.goals
for each row execute function public.set_updated_at();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
      split_part(coalesce(new.email, 'runner'), '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.planned_runs enable row level security;
alter table public.runs enable row level security;
alter table public.goals enable row level security;

create policy "profiles_select_own"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "planned_runs_select_own"
on public.planned_runs for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "planned_runs_insert_own"
on public.planned_runs for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "planned_runs_update_own"
on public.planned_runs for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "planned_runs_delete_own"
on public.planned_runs for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "runs_select_own"
on public.runs for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "runs_insert_own"
on public.runs for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and (
    planned_run_id is null
    or exists (
      select 1
      from public.planned_runs
      where planned_runs.id = planned_run_id
        and planned_runs.user_id = (select auth.uid())
    )
  )
);

create policy "runs_update_own"
on public.runs for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    planned_run_id is null
    or exists (
      select 1
      from public.planned_runs
      where planned_runs.id = planned_run_id
        and planned_runs.user_id = (select auth.uid())
    )
  )
);

create policy "runs_delete_own"
on public.runs for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "goals_select_own"
on public.goals for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "goals_insert_own"
on public.goals for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "goals_update_own"
on public.goals for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "goals_delete_own"
on public.goals for delete
to authenticated
using ((select auth.uid()) = user_id);

revoke all on all tables in schema public from anon, authenticated;
revoke all on all functions in schema public from anon, authenticated;

grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.planned_runs to authenticated;
grant select, insert, update, delete on public.runs to authenticated;
grant select, insert, update, delete on public.goals to authenticated;

