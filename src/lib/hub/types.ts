export type Status = 'inkorg' | 'ide' | 'filmad' | 'klippt' | 'schemalagd' | 'ute';
export type Pelare = 'omdome' | 'jobbet' | 'agenter' | 'skarm';
export type Format = 'ratt' | 'klippt' | 'folj_med' | 'text' | 'bild' | 'video';
export type Kanal = 'tiktok' | 'reels' | 'linkedin';

export interface Piece {
	id: string;
	status: Status;
	typ: 'film' | 'inlagg';
	format: Format | null;
	pelare: Pelare | null;
	kanaler: Kanal[];
	titel: string;
	text: string;
	anteckning: string;
	fil: string | null;
	projekt: string | null;
	planerad: string | null;
	postad: string | null;
	siffror: Record<string, number>;
	created_at: string;
}

export interface BankItem {
	id: string;
	beskrivning: string;
	plats: string | null;
	projekt: string | null;
	filmad: string | null;
	taggar: string[];
	anvand: boolean;
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

export interface Stat {
	id: string;
	datum: string;
	kanal: 'tiktok' | 'instagram' | 'linkedin';
	foljare: number;
}

export interface Tables {
	hub_pieces: Piece;
	hub_bank: BankItem;
	hub_events: HubEvent;
	hub_todos: Todo;
	hub_stats: Stat;
}

export const STATUS: { id: Status; namn: string }[] = [
	{ id: 'inkorg', namn: 'Inkorg' },
	{ id: 'ide', namn: 'Idé' },
	{ id: 'filmad', namn: 'Filmad' },
	{ id: 'klippt', namn: 'Klippt' },
	{ id: 'schemalagd', namn: 'Schemalagd' },
	{ id: 'ute', namn: 'Ute' }
];

export const PELARE: { id: Pelare; namn: string; dag: string }[] = [
	{ id: 'omdome', namn: 'Omdöme', dag: 'Tisdag' },
	{ id: 'jobbet', namn: 'Jobbet', dag: 'Onsdag' },
	{ id: 'agenter', namn: 'Mina agenter', dag: 'Udda torsdagar' },
	{ id: 'skarm', namn: 'Skärm till samtal', dag: 'Jämna torsdagar' }
];

export const FORMAT: { id: Format; namn: string }[] = [
	{ id: 'ratt', namn: 'Rått samtal' },
	{ id: 'klippt', namn: 'Klippt film' },
	{ id: 'folj_med', namn: 'Följ med' },
	{ id: 'text', namn: 'Text' },
	{ id: 'bild', namn: 'Bild' },
	{ id: 'video', namn: 'Video' }
];

export const KANALER: { id: Kanal; namn: string }[] = [
	{ id: 'tiktok', namn: 'TikTok' },
	{ id: 'reels', namn: 'Reels' },
	{ id: 'linkedin', namn: 'LinkedIn' }
];

export const SIFFROR: { id: string; namn: string }[] = [
	{ id: 'visningar', namn: 'Visningar' },
	{ id: 'forbi3s', namn: 'Förbi 3 s (%)' },
	{ id: 'tittartid', namn: 'Snitt tittartid (s)' },
	{ id: 'delningar', namn: 'Delningar' },
	{ id: 'sparningar', namn: 'Sparningar' },
	{ id: 'reaktioner', namn: 'Reaktioner' },
	{ id: 'kommentarer', namn: 'Kommentarer' }
];

export const namnFor = <T extends { id: string; namn: string }>(lista: T[], id: string | null) =>
	lista.find((x) => x.id === id)?.namn ?? '';
