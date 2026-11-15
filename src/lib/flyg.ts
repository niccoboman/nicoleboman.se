// Mjuk scroll: ett gemensamt värde som glider efter den riktiga scrollen med lite tröghet,
// så att effekterna inte rycker med varje hack i mushjulet. Alla effekter i filen läser det.
// TRÖGHET: andel av avståndet som tas igen per bildruta vid 60 fps (lägre = mjukare men segare).
const TROGHET = 0.1;
const lyssnare = new Set<(y: number) => void>();
let mjukY = 0;
let loop = 0;
let senast = 0;

function tick(nu: number) {
	const dt = senast ? Math.min(64, nu - senast) : 16.7;
	senast = nu;
	const mal = scrollY;
	const k = 1 - Math.pow(1 - TROGHET, dt / 16.7);
	mjukY += (mal - mjukY) * k;
	if (Math.abs(mal - mjukY) < 0.25) mjukY = mal;
	for (const f of lyssnare) f(mjukY);
	if (mjukY !== mal) loop = requestAnimationFrame(tick);
	else {
		loop = 0;
		senast = 0;
	}
}
function starta() {
	if (!loop) loop = requestAnimationFrame(tick);
}
function folj(f: (y: number) => void) {
	if (!lyssnare.size) {
		mjukY = scrollY;
		addEventListener('scroll', starta, { passive: true });
	}
	lyssnare.add(f);
	f(mjukY);
	return () => {
		lyssnare.delete(f);
		if (!lyssnare.size) {
			removeEventListener('scroll', starta);
			cancelAnimationFrame(loop);
			loop = 0;
		}
	};
}

// Flyg: namnet i inledningen glider ner och krymper med scrollen tills det ligger exakt på
// målordet (elementet med [data-namn-mal]). Målordet görs osynligt (opacity, inte visibility, så att det följer med när man kopierar texten).
// Noden ska vara inline-block och bara innehålla ordet. Gör ingenting vid minskad rörelse.
// Parametern (t.ex. språket) gör att namnet mäter om när meningen byts ut.
export function flyg(node: HTMLElement, _nyckel?: unknown) {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	// Målordet letas upp på nytt varje gång: vid språkbyte återanvänder Svelte orden i meningen,
	// så det gamla elementet kan ha blivit ett annat ord.
	let mal: HTMLElement | null = null;
	const hamta = () => {
		const ny = document.querySelector<HTMLElement>('[data-namn-mal]');
		if (ny !== mal) {
			if (mal) mal.style.opacity = '';
			mal = ny;
			m = null;
		}
		return mal;
	};
	// Bara på bred skärm. På mobil ligger bilden i full bredd mellan namnet och meningen,
	// så namnet hinner inte landa; där står ordet kvar i meningen och namnet ligger still.
	const bred = matchMedia('(min-width: 768px)');
	node.style.transformOrigin = '0 0';

	let sy = scrollY;
	let m: { tx: number; ty: number; s: number; slut: number } | null = null;

	// Läs ut båda ordens plats i dokumentet utan egna transformer
	const mat = (mal: HTMLElement) => {
		const spar = node.style.transform;
		node.style.transform = 'none';
		const h = node.getBoundingClientRect();
		node.style.transform = spar;
		const t = mal.getBoundingClientRect();
		const mt = new DOMMatrixReadOnly(getComputedStyle(mal).transform === 'none' ? undefined : getComputedStyle(mal).transform);
		const tTop = t.top - mt.m42 + scrollY;
		const tLeft = t.left - mt.m41;
		const hTop = h.top + scrollY;
		const s = t.width / h.width;
		m = {
			s,
			tx: tLeft - h.left,
			// Mitten mot mitten: halva radavståndet är lika stort över och under ordet
			ty: tTop + t.height / 2 - (hTop + (h.height * s) / 2),
			// Landat när målordet står en bit ovanför mitten av skärmen (lägre värde = långsammare)
			slut: Math.max(1, tTop + t.height / 2 - innerHeight * 0.35)
		};
	};

	const rita = (my: number) => {
		sy = my;
		const mal = hamta();
		if (!mal || !bred.matches) {
			node.style.transform = '';
			node.style.willChange = '';
			if (mal) mal.style.opacity = '';
			return;
		}
		mal.style.opacity = '0';
		node.style.willChange = 'transform';
		if (!m) mat(mal);
		if (!m) return;
		const r = Math.min(1, Math.max(0, my / m.slut));
		const p = r * r * (3 - 2 * r);
		node.style.transform = `translate3d(${(m.tx * p).toFixed(2)}px, ${(m.ty * p).toFixed(2)}px, 0) scale(${(1 + (m.s - 1) * p).toFixed(4)})`;
	};
	const om = () => {
		m = null;
		rita(sy);
	};

	const sluta = folj(rita);
	document.fonts?.ready.then(om);
	// Namnet glider in vid start (translate i CSS), mät igen när det står still
	const timer = setTimeout(om, 1600);
	addEventListener('resize', om);
	addEventListener('load', om);
	bred.addEventListener('change', om);
	return {
		// Språket bytt: vänta tills Svelte har skrivit om meningen, mät sedan igen
		update() {
			requestAnimationFrame(om);
		},
		destroy() {
			sluta();
			clearTimeout(timer);
			bred.removeEventListener('change', om);
			removeEventListener('resize', om);
			removeEventListener('load', om);
			if (mal) mal.style.opacity = '';
		}
	};
}
