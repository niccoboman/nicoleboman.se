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

// Parallax: flyttar noden lite i takt med scrollen. y/x = hur mycket (andel av avståndet till nollpunkten).
// noll = var på skärmen (andel av höjden) noden står på sin vanliga plats; 0.5 = mitten.
// Gör ingenting för den som valt minskad rörelse.
export function parallax(node: HTMLElement, opt: { y?: number; x?: number; skala?: number; noll?: number; scroll?: boolean } = {}) {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	let { y = 0, x = 0, skala = 1, noll = 0.5, scroll = false } = opt;
	let sy = scrollY;
	const rita = (my: number) => {
		sy = my;
		// scroll: true = räkna från sidans topp (för inledningen, så att allt står still vid start)
		let avstand: number;
		if (scroll) avstand = -my;
		else {
			// Nodens plats som om sidan stod på den mjuka scrollen
			const r = node.getBoundingClientRect();
			avstand = r.top + (scrollY - my) + r.height / 2 - innerHeight * noll;
		}
		node.style.transform = `translate3d(${(-avstand * x).toFixed(2)}px, ${(-avstand * y).toFixed(2)}px, 0) scale(${skala})`;
	};
	const igen = () => rita(sy);
	node.style.willChange = 'transform';
	const sluta = folj(rita);
	addEventListener('resize', igen);
	return {
		update(ny: typeof opt) {
			({ y = 0, x = 0, skala = 1, noll = 0.5, scroll = false } = ny);
			igen();
		},
		destroy() {
			sluta();
			removeEventListener('resize', igen);
		}
	};
}

// Växa: bilden i om-delen växer med scrollen i två steg (bara på skärmar från 768 px).
// Steg 1 (p): växer från liten till 1,6 gånger uppåt från nedre vänstra hörnet.
// Steg 2 (q): växer vidare från övre vänstra hörnet tills den är lika bred som avsnittet och täcker texten.
// Noden innehåller figuren .vaxbild (platshållare) och .vaxlager (bilden i full bredd, skalas ner).
export function vaxa(node: HTMLElement) {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	const fig = node.querySelector<HTMLElement>('.vaxbild');
	const lager = node.querySelector<HTMLElement>('.vaxlager');
	if (!fig || !lager) return;
	const stor = matchMedia('(min-width: 768px)');
	let sy = scrollY;
	let bas = 0.32;
	let h = 0;
	const mat = () => {
		bas = lager.offsetWidth ? fig.offsetWidth / lager.offsetWidth : 0.32;
		h = fig.offsetHeight;
	};
	const rita = (my: number) => {
		sy = my;
		if (!stor.matches) {
			lager.style.transform = '';
			fig.style.zIndex = '';
			return;
		}
		const top = node.getBoundingClientRect().top + (scrollY - my);
		const raw = (innerHeight * 0.75 - top) / (innerHeight * 0.7);
		const p = Math.min(1, Math.max(0, raw));
		const q = Math.min(1, Math.max(0, (raw - 1.1) / 0.9));
		const s1 = 1 + 0.6 * p;
		// Steg 2 slutar i full bredd: bas × s1 × s2 = 1
		const s2 = 1 + q * (1 / (bas * 1.6) - 1);
		// Steg 1 växer uppåt: flytta upp lika mycket som höjden ökat
		lager.style.transform = `translate3d(0, ${(h * (1 - s1)).toFixed(2)}px, 0) scale(${(bas * s1 * s2).toFixed(5)})`;
		// Bilden läggs över namnet i inledningen först när den börjar täcka texten
		fig.style.zIndex = q > 0 ? '30' : '10';
	};
	const igen = () => {
		mat();
		rita(sy);
	};
	mat();
	const sluta = folj(rita);
	addEventListener('resize', igen);
	return {
		destroy() {
			sluta();
			removeEventListener('resize', igen);
		}
	};
}

// Flyg: namnet i inledningen glider ner och krymper med scrollen tills det ligger exakt på
// målordet (elementet med [data-namn-mal]). Målordet döljs, så det är namnet som landar där.
// Noden ska vara inline-block och bara innehålla ordet. Gör ingenting vid minskad rörelse.
export function flyg(node: HTMLElement) {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	const mal = document.querySelector<HTMLElement>('[data-namn-mal]');
	if (!mal) return;
	mal.style.visibility = 'hidden';
	node.style.transformOrigin = '0 0';
	node.style.willChange = 'transform';

	let sy = scrollY;
	let m: { tx: number; ty: number; s: number; slut: number } | null = null;

	// Läs ut båda ordens plats i dokumentet utan egna transformer
	const mat = () => {
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
		if (!m) mat();
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
	return {
		destroy() {
			sluta();
			clearTimeout(timer);
			removeEventListener('resize', om);
			removeEventListener('load', om);
			mal.style.visibility = '';
		}
	};
}
