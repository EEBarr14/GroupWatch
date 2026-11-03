create or replace function public.get_public_watchlist(requested_slug text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'display_name', profile.display_name,
    'entries', coalesce(
      jsonb_agg(
        jsonb_build_object(
          'title', entry.title,
          'media_type', entry.media_type,
          'watch_status', entry.watch_status,
          'rating', entry.rating,
          'genre', genre.name
        )
        order by entry.created_at desc
      ) filter (where entry.id is not null),
      '[]'::jsonb
    )
  )
  from public.users as profile
  left join public.media_entries as entry
    on entry.user_id = profile.id
  left join public.genres as genre
    on genre.id = entry.genre_id
  where profile.share_enabled = true
    and profile.share_slug = requested_slug
  group by profile.id, profile.display_name;
$$;

revoke all on function public.get_public_watchlist(text) from public;
grant execute on function public.get_public_watchlist(text) to anon, authenticated;
