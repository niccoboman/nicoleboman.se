-- Innehållshubben på /hub: filmer och inlägg, kalender och veckans att göra.
-- Bara ägaren läser och skriver (RLS). Skillsen på Nicoles dator skriver via service_role och sätter user_id själva.

create extension if not exists pgcrypto;

-- Allt som ska ut: från lös tanke till publicerad film eller inlägg.
create table if not exists public.hub_pieces (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
	status text not null default 'inkorg' check (status in ('inkorg', 'ide', 'filmad', 'klippt', 'schemalagd', 'ute')),
	typ text not null default 'film' check (typ in ('film', 'inlagg')),
	format text check (format is null or format in ('ratt', 'klippt', 'folj_med', 'text')),
	pelare text check (pelare is null or pelare in ('omdome', 'jobbet', 'agenter', 'skarm')),
	titel text not null check (char_length(titel) between 1 and 300),
	text text not null default '',
	anteckning text not null default '',
	fil text,
	planerad timestamptz,
	postad timestamptz,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

-- Inbokade dagar, resor, filmblock och kontroller.
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

create index if not exists hub_pieces_user_status_idx on public.hub_pieces (user_id, status, planerad);
create index if not exists hub_events_user_datum_idx on public.hub_events (user_id, datum);
create index if not exists hub_todos_user_vecka_idx on public.hub_todos (user_id, vecka, sort);

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

-- Samma regler för alla tre tabellerna: bara ägaren, aldrig anon.
do $$
declare t text;
begin
	foreach t in array array['hub_pieces', 'hub_events', 'hub_todos'] loop
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
