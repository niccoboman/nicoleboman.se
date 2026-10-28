export type Status = 'inkorg' | 'ide' | 'filmad' | 'klippt' | 'schemalagd' | 'ute';
export type Pelare = 'omdome' | 'jobbet' | 'agenter' | 'skarm';
export type Format = 'ratt' | 'klippt' | 'folj_med' | 'text';

export interface Piece {
	id: string;
	status: Status;
	typ: 'film' | 'inlagg';
	format: Format | null;
	pelare: Pelare | null;
	titel: string;
	text: string;
	anteckning: string;
	fil: string | null;
	planerad: string | null;
	postad: string | null;
	created_at: string;
}

export interface HubEvent {
	id: string;
	datum: string;
	slut: string | null;
	titel: string;
	typ: 'uppdrag' | 'resa' | 'ledigt' | 'filmblock' | 'kontroll';
	anteckning: string;
}

export interface Todo {
	id: string;
	vecka: string;
	dag: string;
	text: string;
	klar: boolean;
	sort: number;
}

export interface Tables {
	hub_pieces: Piece;
	hub_events: HubEvent;
	hub_todos: Todo;
}

/** Målet: filmer ute till 21 januari. */
export const MAL = { filmer: 33, datum: '2027-01-21' };

export const STATUS: { id: Status; namn: string }[] = [
	{ id: 'inkorg', namn: 'Inkorg' },
	{ id: 'ide', namn: 'Idé' },
	{ id: 'filmad', namn: 'Filmad' },
	{ id: 'klippt', namn: 'Klippt' },
	{ id: 'schemalagd', namn: 'Schemalagd' },
	{ id: 'ute', namn: 'Ute' }
];

export const PELARE: { id: Pelare; namn: string }[] = [
	{ id: 'omdome', namn: 'Omdöme' },
	{ id: 'jobbet', namn: 'Jobbet' },
	{ id: 'agenter', namn: 'Mina agenter' },
	{ id: 'skarm', namn: 'Skärm till samtal' }
];

export const FORMAT: { id: Format; namn: string }[] = [
	{ id: 'ratt', namn: 'Rått samtal' },
	{ id: 'klippt', namn: 'Klippt film' },
	{ id: 'folj_med', namn: 'Följ med' },
	{ id: 'text', namn: 'LinkedIn-text' }
];

export const namnFor = <T extends { id: string; namn: string }>(lista: T[], id: string | null) =>
	lista.find((x) => x.id === id)?.namn ?? '';

/** Nästa steg. Inlägg filmas och klipps inte, så de hoppar direkt till schemalagd. */
export function nastaSteg(p: Pick<Piece, 'status' | 'typ'>) {
	const steg = STATUS.filter((s) => p.typ === 'film' || (s.id !== 'filmad' && s.id !== 'klippt'));
	return steg[steg.findIndex((s) => s.id === p.status) + 1];
}
