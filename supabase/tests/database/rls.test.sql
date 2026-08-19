begin;

select plan(7);

insert into auth.users (id, email, raw_user_meta_data)
values
  (
    '10000000-0000-0000-0000-000000000001',
    'ana@example.test',
    '{"display_name":"Ana"}'::jsonb
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    'bia@example.test',
    '{"display_name":"Bia"}'::jsonb
  );

insert into public.planned_runs (
  id,
  user_id,
  scheduled_for,
  target_distance_km
)
values (
  '20000000-0000-0000-0000-000000000099',
  '20000000-0000-0000-0000-000000000002',
  current_date,
  5
);

set local role authenticated;
set local request.jwt.claim.sub = '10000000-0000-0000-0000-000000000001';

select is(
  (select count(*)::integer from public.profiles),
  1,
  'a user can only read their own profile'
);

select lives_ok(
  $$
    insert into public.planned_runs (
      id,
      user_id,
      scheduled_for,
      target_distance_km
    ) values (
      '10000000-0000-0000-0000-000000000099',
      '10000000-0000-0000-0000-000000000001',
      current_date,
      5
    )
  $$,
  'a user can create their own planned run'
);

select throws_ok(
  $$
    insert into public.planned_runs (
      user_id,
      scheduled_for,
      target_distance_km
    ) values (
      '20000000-0000-0000-0000-000000000002',
      current_date,
      5
    )
  $$,
  '42501',
  'new row violates row-level security policy for table "planned_runs"',
  'a user cannot create a planned run for another user'
);

select lives_ok(
  $$
    insert into public.runs (
      user_id,
      planned_run_id,
      performed_at,
      distance_km,
      duration_seconds
    ) values (
      '10000000-0000-0000-0000-000000000001',
      '10000000-0000-0000-0000-000000000099',
      now(),
      5,
      1800
    )
  $$,
  'a user can record a run against their own plan'
);

select is(
  (
    select status::text
    from public.planned_runs
    where id = '10000000-0000-0000-0000-000000000099'
  ),
  'completed',
  'recording a run completes the linked plan atomically'
);

select throws_ok(
  $$
    insert into public.runs (
      user_id,
      planned_run_id,
      performed_at,
      distance_km,
      duration_seconds
    ) values (
      '10000000-0000-0000-0000-000000000001',
      '20000000-0000-0000-0000-000000000099',
      now(),
      5,
      1800
    )
  $$,
  '42501',
  'new row violates row-level security policy for table "runs"',
  'a user cannot attach a run to another user plan'
);

select throws_ok(
  $$
    insert into public.goals (
      user_id,
      kind,
      title,
      target_value,
      unit
    ) values (
      '10000000-0000-0000-0000-000000000001',
      'weekly_frequency',
      'Correr três vezes',
      3,
      'km'
    )
  $$,
  '23514',
  'new row for relation "goals" violates check constraint "goal_kind_matches_unit"',
  'a goal kind must use its corresponding unit'
);

select * from finish();
rollback;
