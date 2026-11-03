-- GroupWatch data-isolation integration test
--
-- Run this whole file in the Supabase SQL editor. It creates one temporary
-- entry, acts as a different authenticated user, and proves that Row Level
-- Security hides and protects the entry. The final rollback removes every
-- test change.

begin;

create temporary table data_isolation_fixture (
  entry_id uuid primary key,
  user_a_id uuid not null,
  user_b_id uuid not null
) on commit drop;

create temporary table data_isolation_results (
  check_name text primary key,
  expected_rows bigint not null,
  actual_rows bigint not null
) on commit drop;

grant select on table pg_temp.data_isolation_fixture to authenticated;
grant select, insert on table pg_temp.data_isolation_results to authenticated;

insert into pg_temp.data_isolation_fixture (entry_id, user_a_id, user_b_id)
select
  '00000000-0000-4000-8000-000000000a01'::uuid,
  owner.id,
  '00000000-0000-4000-8000-000000000b02'::uuid
from public.users as owner
order by owner.created_at
limit 1;

do $$
begin
  if not exists (select 1 from pg_temp.data_isolation_fixture) then
    raise exception 'Data-isolation test needs at least one GroupWatch user.';
  end if;
end;
$$;

insert into public.media_entries (
  id,
  user_id,
  genre_id,
  title,
  media_type,
  watch_status
)
select
  fixture.entry_id,
  fixture.user_a_id,
  genre.id,
  'GroupWatch isolation test entry',
  'TV Show',
  'Watching'
from pg_temp.data_isolation_fixture as fixture
cross join lateral (
  select id
  from public.genres
  order by id
  limit 1
) as genre;

set local role authenticated;

select set_config(
  'request.jwt.claim.sub',
  (select user_b_id::text from pg_temp.data_isolation_fixture),
  true
);
select set_config('request.jwt.claim.role', 'authenticated', true);

insert into pg_temp.data_isolation_results (
  check_name,
  expected_rows,
  actual_rows
)
select
  'User B cannot read User A entry',
  0,
  count(*)
from public.media_entries
where id = (select entry_id from pg_temp.data_isolation_fixture);

with changed_rows as (
  update public.media_entries
  set title = 'User B should never be able to write this'
  where id = (select entry_id from pg_temp.data_isolation_fixture)
  returning 1
)
insert into pg_temp.data_isolation_results (
  check_name,
  expected_rows,
  actual_rows
)
select
  'User B cannot edit User A entry',
  0,
  count(*)
from changed_rows;

with deleted_rows as (
  delete from public.media_entries
  where id = (select entry_id from pg_temp.data_isolation_fixture)
  returning 1
)
insert into pg_temp.data_isolation_results (
  check_name,
  expected_rows,
  actual_rows
)
select
  'User B cannot delete User A entry',
  0,
  count(*)
from deleted_rows;

reset role;

do $$
declare
  failures text;
begin
  select string_agg(check_name, '; ' order by check_name)
  into failures
  from pg_temp.data_isolation_results
  where actual_rows <> expected_rows;

  if failures is not null then
    raise exception 'Data isolation failed: %', failures;
  end if;
end;
$$;

select
  check_name,
  expected_rows,
  actual_rows,
  case
    when actual_rows = expected_rows then 'PASS'
    else 'FAIL'
  end as result
from pg_temp.data_isolation_results
order by check_name;

rollback;
