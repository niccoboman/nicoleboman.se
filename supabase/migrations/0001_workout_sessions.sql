-- Pass-loggar
create table public.sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  workout_key     text not null,
  planned_key     text not null,
  started_at      timestamptz not null default now(),
  completed_at    timestamptz,
  notes           text,
  duration_min    int,
  activity_type   text,
  created_at      timestamptz not null default now()
);

create index sessions_user_started_idx
  on public.sessions(user_id, started_at desc);

-- Set-loggar (bara för kind=strength)
create table public.session_sets (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid not null references public.sessions(id) on delete cascade,
  user_id        uuid not null references auth.users(id) on delete cascade,
  exercise_key   text not null,
  set_number     int  not null,
  side           text check (side in ('left', 'right') or side is null),
  value          int  not null,
  weight_kg      numeric(5,2),
  rir            int check (rir >= 0 and rir <= 5),
  logged_at      timestamptz not null default now()
);

create index session_sets_session_idx
  on public.session_sets(session_id);

create index session_sets_user_exercise_idx
  on public.session_sets(user_id, exercise_key, logged_at desc);

-- Förhindra duplicerade set-rader vid race conditions i upsertSet
create unique index session_sets_unique_setkey
  on public.session_sets(session_id, exercise_key, set_number, coalesce(side, 'none'));

-- RLS
alter table public.sessions enable row level security;
alter table public.session_sets enable row level security;

create policy "Own sessions"
  on public.sessions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Own session_sets"
  on public.session_sets
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
