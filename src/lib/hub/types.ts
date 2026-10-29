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

/** Varje pelare har en egen färg (variablerna ligger i hub.css) så att man ser kategorin direkt. */
export const PELARE: { id: Pelare; namn: string; om: string; fragor: string[] }[] = [
	{
		id: 'omdome',
		namn: 'Omdöme',
		om: 'Vad jag tycker om AI på jobbet. Frågan före verktyget, myter, åsikter.',
		fragor: [
			'Vilken AI-myt hörde du senast på en kurs?',
			'Vad tycker du som de flesta inte håller med om?',
			'Vilken fråga borde en ledningsgrupp ställa innan de köper något?'
		]
	},
	{
		id: 'jobbet',
		namn: 'Jobbet',
		om: 'Ett jobb som inte fanns för tre år sen: kursdagar, scener, vad folk frågar.',
		fragor: [
			'Vad hände på senaste kursdagen som ingen skulle tro?',
			'Vad frågar folk dig alltid i pausen?',
			'Hur ser en vanlig tisdag ut för dig?'
		]
	},
	{
		id: 'agenter',
		namn: 'Mina agenter',
		om: 'Hur jag själv jobbar med AI: rösten, inkorgen, min AI-anställda.',
		fragor: [
			'Vad gjorde din AI-anställda åt dig i dag?',
			'Vilket ADHD-system har AI fixat åt dig?',
			'Vilken prompt använder du varje vecka?'
		]
	},
	{
		id: 'skarm',
		namn: 'Skärm till samtal',
		om: 'Livet runt omkring: promenader, fokus, tempo, huset, språken.',
		fragor: [
			'Vad tänkte du på under senaste promenaden?',
			'När la du bort mobilen senast, och vad hände?',
			'Vad håller du på att lära dig utanför jobbet?'
		]
	}
];

/** Varför hubben och kontot finns. Ett utkast i Nicoles anda, som hon skriver om med egna ord. */
export const MANIFEST = [
	'Jag står i klassrum och på scener varje vecka och ser vad som händer när vanliga människor möter AI. Det är det jag vill visa, på svenska och med omdöme.',
	'Det här är mitt: mina tankar, mitt jobb, mina agenter och livet runt omkring. Tekniken ska ge oss tillbaka tid och närvaro, och jag visar hur det går till.',
	'Om någon ser en film och tänker att de också kan, har den gjort sitt jobb.'
];

export const pelarFarg = (id: Pelare | null) => (id ? `var(--p-${id})` : 'var(--color-grafit)');

/** Var det ska ut. Inlägg = LinkedIn, filmer = TikTok och Reels (LinkedIn när det är en klippt film eller följ med). */
export function plattform(p: Pick<Piece, 'typ' | 'format'>) {
	if (p.typ === 'inlagg') return 'LinkedIn';
	return p.format === 'klippt' ? 'Reels · LinkedIn' : 'TikTok · Reels';
}

/** Det som ska göras härnäst, i klartext. */
export function attGora(p: Pick<Piece, 'status' | 'typ'>) {
	if (p.status === 'ute') return 'Ute';
	if (p.status === 'schemalagd') return 'Klar';
	if (p.typ === 'inlagg') return 'Att skriva';
	return { inkorg: 'Att sortera', ide: 'Att filma', filmad: 'Att klippa', klippt: 'Att schemalägga' }[p.status];
}

/** Stegen en bit går igenom, utan inkorgen. */
export const stegFor = (p: Pick<Piece, 'typ'>) =>
	STATUS.filter((s) => s.id !== 'inkorg' && (p.typ === 'film' || (s.id !== 'filmad' && s.id !== 'klippt')));

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

/** Ett tips och vad hon kan säga till Claude för steget en bit står i. Claude läser hubben, så inget behöver kopieras. */
export function hjalp(p: Pick<Piece, 'status' | 'typ' | 'titel'>): { tips: string; prompt: string } | null {
	const t = `"${p.titel}"`;
	if (p.typ === 'inlagg') {
		if (p.status === 'ide') return { tips: 'Prata in det som du skulle säga det till en kund. En scen eller replik först.', prompt: '/linkedin och prata in tanken' };
		if (p.status === 'schemalagd') return { tips: 'Svara på kommentarerna första timmen.', prompt: '/linkedin postat' };
		return null;
	}
	switch (p.status) {
		case 'ide':
			return { tips: 'En tagning, 1–3 min. Säg kroken först och titta in i kameran på slutet.', prompt: `ge mig krokar till ${t}` };
		case 'filmad':
			return { tips: 'AirDroppa till Macen. Säg vilka ord du vill betona.', prompt: `/klipp ${t}` };
		case 'klippt':
			return { tips: 'TikTok Studio schemalägger max 10 dagar fram.', prompt: `caption till ${t}` };
		case 'schemalagd':
			return { tips: 'Svara på kommentarerna första timmen efter att den gått ut.', prompt: '/tiktok nu postar jag' };
		default:
			return null;
	}
}
