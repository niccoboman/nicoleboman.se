import { supabase } from './supabase';
import seed from './seed.json';
import type { Tables } from './types';

type Name = keyof Tables;
const NAMES: Name[] = ['hub_pieces', 'hub_bank', 'hub_events', 'hub_todos', 'hub_stats'];

// All hubbdata ligger i minnet (det är några hundra rader som mest). I förhandsläget
// (?preview=1 lokalt) skrivs inget till Supabase; startdatan används i stället.
export const hub = $state({
	ready: false,
	preview: false,
	error: '',
	hub_pieces: [] as Tables['hub_pieces'][],
	hub_bank: [] as Tables['hub_bank'][],
	hub_events: [] as Tables['hub_events'][],
	hub_todos: [] as Tables['hub_todos'][],
	hub_stats: [] as Tables['hub_stats'][]
});

const nyttId = () => crypto.randomUUID();
const nu = () => new Date().toISOString();

export async function ladda(preview: boolean) {
	hub.preview = preview;
	hub.error = '';
	if (preview) {
		for (const n of NAMES) {
			// @ts-expect-error startdatan saknar id och tidsstämplar; de sätts här
			hub[n] = (seed[n] as object[]).map((r) => ({ id: nyttId(), created_at: nu(), ...r }));
		}
		hub.ready = true;
		return;
	}
	if (!supabase) {
		hub.error = 'Supabase är inte inställt.';
		return;
	}
	const svar = await Promise.all(NAMES.map((n) => supabase!.from(n).select('*')));
	svar.forEach(({ data, error }, i) => {
		if (error) hub.error = error.message;
		else hub[NAMES[i]] = (data ?? []) as never;
	});
	hub.ready = true;
}

export async function lagg<N extends Name>(n: N, rad: Partial<Tables[N]>) {
	const ny = { id: nyttId(), created_at: nu(), ...rad } as Tables[N];
	(hub[n] as Tables[N][]).push(ny);
	if (hub.preview || !supabase) return ny;
	const { error } = await supabase.from(n).insert(ny);
	if (error) {
		hub.error = error.message;
		hub[n] = (hub[n] as Tables[N][]).filter((r) => r.id !== ny.id) as never;
	}
	return ny;
}

export async function andra<N extends Name>(n: N, id: string, andring: Partial<Tables[N]>) {
	const rad = (hub[n] as Tables[N][]).find((r) => r.id === id);
	if (!rad) return;
	const fore = { ...rad };
	Object.assign(rad, andring);
	if (hub.preview || !supabase) return;
	const { error } = await supabase.from(n).update(andring as never).eq('id', id);
	if (error) {
		hub.error = error.message;
		Object.assign(rad, fore);
	}
}

export async function tabort(n: Name, id: string) {
	const fore = hub[n];
	hub[n] = (hub[n] as { id: string }[]).filter((r) => r.id !== id) as never;
	if (hub.preview || !supabase) return;
	const { error } = await supabase.from(n).delete().eq('id', id);
	if (error) {
		hub.error = error.message;
		hub[n] = fore as never;
	}
}
