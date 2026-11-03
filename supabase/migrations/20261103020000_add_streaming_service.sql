alter table public.media_entries
  add column streaming_service text
    check (
      streaming_service is null
      or streaming_service in (
        'Prime Video',
        'Apple TV+',
        'Netflix',
        'Hulu',
        'Disney+',
        'Peacock',
        'Other'
      )
    );
