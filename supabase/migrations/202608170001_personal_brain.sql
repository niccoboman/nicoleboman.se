-- Personal-only capture queue and rebuildable Markdown index.
-- Canonical text lives in the private nicole-personal-os Git repository.

create extension if not exists pgcrypto;

create table if not exists public.brain_captures (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references auth.users(id) on delete cascade,
	content text not null check (char_length(content) between 1 and 20000),
	title text check (title is null or char_length(title) <= 120),
	collection text not null default 'inbox' check (collection in ('inbox', 'daily', 'projects', 'people', 'writing', 'knowledge', 'health', 'finance')),
	tags text[] not null default '{}',
	attachments jsonb not null default '[]'::jsonb check (jsonb_typeof(attachments) = 'array'),
	source text not null default 'admin' check (source in ('admin', 'ia-writer', 'codex', 'claude', 'import')),
	state text not null default 'pending' check (state in ('pending', 'processing', 'completed', 'failed')),
	canonical_path text,
	error text,
	created_at timestamptz not null default now(),
	processing_started_at timestamptz,
	processed_at timestamptz
);

create index if not exists brain_captures_user_created_idx
	on public.brain_captures (user_id, created_at desc);
create index if not exists brain_captures_pending_idx
	on public.brain_captures (created_at asc)
	where state = 'pending';

alter table public.brain_captures enable row level security;

revoke all on table public.brain_captures from anon;
grant select, insert, update on table public.brain_captures to authenticated;
grant select, insert, update on table public.brain_captures to service_role;

drop policy if exists "brain captures insert own" on public.brain_captures;
create policy "brain captures insert own"
	on public.brain_captures for insert to authenticated
	with check (auth.uid() = user_id);

drop policy if exists "brain captures select own" on public.brain_captures;
create policy "brain captures select own"
	on public.brain_captures for select to authenticated
	using (auth.uid() = user_id);

drop policy if exists "brain captures update own" on public.brain_captures;
create policy "brain captures update own"
	on public.brain_captures for update to authenticated
	using (auth.uid() = user_id)
	with check (auth.uid() = user_id);

create table if not exists public.brain_documents (
	id uuid primary key,
	user_id uuid not null references auth.users(id) on delete cascade,
	canonical_path text not null unique,
	title text not null,
	collection text not null,
	excerpt text not null default '',
	tags text[] not null default '{}',
	content_hash text not null,
	created_at timestamptz not null,
	updated_at timestamptz not null
);

create index if not exists brain_documents_user_updated_idx
	on public.brain_documents (user_id, updated_at desc);

alter table public.brain_documents enable row level security;

revoke all on table public.brain_documents from anon;
grant select on table public.brain_documents to authenticated;
grant select, insert, update on table public.brain_documents to service_role;

drop policy if exists "brain documents select own" on public.brain_documents;
create policy "brain documents select own"
	on public.brain_documents for select to authenticated
	using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit)
values ('brain-private', 'brain-private', false, 26214400)
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit;

drop policy if exists "brain media insert own folder" on storage.objects;
create policy "brain media insert own folder"
	on storage.objects for insert to authenticated
	with check (
		bucket_id = 'brain-private'
		and (storage.foldername(name))[1] = auth.uid()::text
	);

drop policy if exists "brain media select own folder" on storage.objects;
create policy "brain media select own folder"
	on storage.objects for select to authenticated
	using (
		bucket_id = 'brain-private'
		and (storage.foldername(name))[1] = auth.uid()::text
	);
