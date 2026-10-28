-- Innehållshubben på /hub: filmer och inlägg, idéer, råmaterial, kalender, att göra och följare.
-- Bara ägaren läser och skriver (RLS). Skillsen på Nicoles dator skriver via service_role och sätter user_id själva.

create extension if not exists pgcrypto;

-- Allt som ska ut: från lös idé till publicerad film eller inlägg.
create table if not exists public.hub_pieces (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
	status text not null default 'inkorg' check (status in ('inkorg', 'ide', 'filmad', 'klippt', 'schemalagd', 'ute')),
	typ text not null default 'film' check (typ in ('film', 'inlagg')),
	format text check (format is null or format in ('ratt', 'klippt', 'folj_med', 'text', 'bild', 'video')),
	pelare text check (pelare is null or pelare in ('omdome', 'jobbet', 'agenter', 'skarm')),
	kanaler text[] not null default '{}',
	titel text not null check (char_length(titel) between 1 and 300),
	text text not null default '',
	anteckning text not null default '',
	fil text,
	projekt text,
	planerad timestamptz,
	postad timestamptz,
	siffror jsonb not null default '{}'::jsonb check (jsonb_typeof(siffror) = 'object'),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

-- Filmat material som inte använts ännu ("hellre för mycket material").
create table if not exists public.hub_bank (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
	beskrivning text not null check (char_length(beskrivning) between 1 and 500),
	plats text,
	projekt text,
	filmad date,
	taggar text[] not null default '{}',
	anvand boolean not null default false,
	piece_id uuid references public.hub_pieces(id) on delete set null,
	created_at timestamptz not null default now()
);

-- Inbokade dagar, resor och filmblock.
create table if not exists public.hub_events (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
	datum date not null,
	slut date,
	titel text not null check (char_length(titel) between 1 and 200),
	typ text not null default 'uppdrag' check (typ in ('uppdrag', 'resa', 'ledigt', 'filmblock', 'kontroll')),
	anteckning text not null default '',
	created_at timestamptz not null default now()
);

-- Veckans att göra. vecka = måndagens datum.
create table if not exists public.hub_todos (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
	vecka date not null,
	dag text not null default '',
	text text not null check (char_length(text) between 1 and 300),
	klar boolean not null default false,
	sort integer not null default 0,
	created_at timestamptz not null default now()
);

-- Följare över tid, per kanal.
create table if not exists public.hub_stats (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
	datum date not null default current_date,
	kanal text not null check (kanal in ('tiktok', 'instagram', 'linkedin')),
	foljare integer not null check (foljare >= 0),
	created_at timestamptz not null default now()
);

create index if not exists hub_pieces_user_status_idx on public.hub_pieces (user_id, status, planerad);
create index if not exists hub_bank_user_idx on public.hub_bank (user_id, anvand, created_at desc);
create index if not exists hub_events_user_datum_idx on public.hub_events (user_id, datum);
create index if not exists hub_todos_user_vecka_idx on public.hub_todos (user_id, vecka, sort);
create index if not exists hub_stats_user_datum_idx on public.hub_stats (user_id, kanal, datum);

create or replace function public.hub_touch_updated_at() returns trigger
language plpgsql as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

drop trigger if exists hub_pieces_touch on public.hub_pieces;
create trigger hub_pieces_touch before update on public.hub_pieces
	for each row execute function public.hub_touch_updated_at();

-- Samma regler för alla fem tabellerna: bara ägaren, aldrig anon.
do $$
declare t text;
begin
	foreach t in array array['hub_pieces', 'hub_bank', 'hub_events', 'hub_todos', 'hub_stats'] loop
		execute format('alter table public.%I enable row level security', t);
		execute format('revoke all on table public.%I from anon', t);
		execute format('grant select, insert, update, delete on table public.%I to authenticated, service_role', t);
		execute format('drop policy if exists "%s own" on public.%I', t, t);
		execute format(
			'create policy "%s own" on public.%I for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)',
			t, t
		);
	end loop;
end;
$$;
