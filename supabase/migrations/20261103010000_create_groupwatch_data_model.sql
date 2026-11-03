create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text not null
    check (char_length(trim(display_name)) between 1 and 80),
  share_enabled boolean not null default false,
  share_slug text unique
    check (
      share_slug is null
      or share_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),
  created_at timestamptz not null default now()
);

create table public.genres (
  id bigint generated always as identity primary key,
  name text not null unique
    check (char_length(trim(name)) between 1 and 50)
);

create table public.media_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  genre_id bigint not null references public.genres (id) on delete restrict,
  title text not null
    check (char_length(trim(title)) between 1 and 200),
  media_type text not null
    check (media_type in ('Movie', 'TV Show')),
  watch_status text not null
    check (watch_status in ('Want to Watch', 'Watching', 'Watched')),
  rating smallint
    check (rating between 1 and 5),
  review text
    check (char_length(review) <= 500),
  started_on date,
  finished_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, id)
);

create table public.stars (
  user_id uuid not null references public.users (id) on delete cascade,
  media_entry_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (user_id, media_entry_id),
  foreign key (user_id, media_entry_id)
    references public.media_entries (user_id, id)
    on delete cascade
);

create or replace function public.create_groupwatch_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
      nullif(split_part(new.email, '@', 1), ''),
      'GroupWatch member'
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger create_groupwatch_user_after_signup
  after insert on auth.users
  for each row execute function public.create_groupwatch_user();

insert into public.users (id, email, display_name)
select
  id,
  email,
  coalesce(
    nullif(trim(raw_user_meta_data ->> 'display_name'), ''),
    nullif(split_part(email, '@', 1), ''),
    'GroupWatch member'
  )
from auth.users
where email is not null
on conflict (id) do nothing;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_media_entries_updated_at
  before update on public.media_entries
  for each row execute function public.set_updated_at();

insert into public.genres (name)
values
  ('Action'),
  ('Animation'),
  ('Comedy'),
  ('Crime'),
  ('Documentary'),
  ('Drama'),
  ('Family'),
  ('Fantasy'),
  ('Horror'),
  ('Reality'),
  ('Romance'),
  ('Science Fiction'),
  ('Thriller')
on conflict (name) do nothing;

alter table public.users enable row level security;
alter table public.genres enable row level security;
alter table public.media_entries enable row level security;
alter table public.stars enable row level security;

create policy "Users can read their own profile"
  on public.users
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.users
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Signed in users can read genres"
  on public.genres
  for select
  to authenticated
  using (true);

create policy "Users can read their own entries"
  on public.media_entries
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own entries"
  on public.media_entries
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own entries"
  on public.media_entries
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own entries"
  on public.media_entries
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read their own stars"
  on public.stars
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own stars"
  on public.stars
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own stars"
  on public.stars
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.users from anon;
revoke all on public.genres from anon;
revoke all on public.media_entries from anon;
revoke all on public.stars from anon;

grant select on public.users to authenticated;
grant update (display_name, share_enabled, share_slug) on public.users to authenticated;
grant select on public.genres to authenticated;
grant select, insert, update, delete on public.media_entries to authenticated;
grant select, insert, delete on public.stars to authenticated;
grant usage, select on sequence public.genres_id_seq to authenticated;
