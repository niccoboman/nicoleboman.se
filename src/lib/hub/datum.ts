// Veckor räknas från måndag. Datum hanteras som ÅÅÅÅ-MM-DD i lokal tid.

export const iso = (d: Date) =>
	`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const fran = (s: string) => new Date(s.slice(0, 10) + 'T12:00:00');

export function mandag(d: Date) {
	const m = new Date(d);
	m.setHours(12, 0, 0, 0);
	m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
	return m;
}

export function plusDagar(d: Date, n: number) {
	const x = new Date(d);
	x.setDate(x.getDate() + n);
	return x;
}

export function veckonummer(d: Date) {
	const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
	t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
	const start = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
	return Math.ceil(((t.getTime() - start.getTime()) / 86400000 + 1) / 7);
}

const MAN = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
const DAG = ['sön', 'mån', 'tis', 'ons', 'tor', 'fre', 'lör'];

export const kort = (d: Date) => `${d.getDate()} ${MAN[d.getMonth()]}`;
export const dagnamn = (d: Date) => DAG[d.getDay()];

export function spann(start: Date) {
	const slut = plusDagar(start, 6);
	return start.getMonth() === slut.getMonth()
		? `${start.getDate()}–${slut.getDate()} ${MAN[slut.getMonth()]}`
		: `${kort(start)}–${kort(slut)}`;
}

export function tidpunkt(s: string | null) {
	if (!s) return '';
	const d = new Date(s);
	return `${dagnamn(d)} ${kort(d)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Ligger datumet s (eller spannet s–slut) i veckan som börjar på måndag m? */
export function iVeckan(m: Date, s: string, slut?: string | null) {
	const a = iso(m);
	const b = iso(plusDagar(m, 6));
	const fr = s.slice(0, 10);
	const ti = (slut ?? s).slice(0, 10);
	return fr <= b && ti >= a;
}
