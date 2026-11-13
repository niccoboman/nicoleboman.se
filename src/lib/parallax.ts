// Parallax: flyttar noden lite i takt med scrollen. y/x = hur mycket (andel av avståndet till nollpunkten).
// noll = var på skärmen (andel av höjden) noden står på sin vanliga plats; 0.5 = mitten.
// Gör ingenting för den som valt minskad rörelse.
export function parallax(node: HTMLElement, opt: { y?: number; x?: number; skala?: number; noll?: number; scroll?: boolean } = {}) {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	let { y = 0, x = 0, skala = 1, noll = 0.5, scroll = false } = opt;
	let ram = 0;
	const rita = () => {
		ram = 0;
		// scroll: true = räkna från sidans topp (för inledningen, så att allt står still vid start)
		let avstand: number;
		if (scroll) avstand = -scrollY;
		else {
			const r = node.getBoundingClientRect();
			avstand = r.top + r.height / 2 - innerHeight * noll;
		}
		node.style.transform = `translate3d(${(-avstand * x).toFixed(1)}px, ${(-avstand * y).toFixed(1)}px, 0) scale(${skala})`;
	};
	const pa = () => {
		if (!ram) ram = requestAnimationFrame(rita);
	};
	node.style.willChange = 'transform';
	rita();
	addEventListener('scroll', pa, { passive: true });
	addEventListener('resize', pa);
	return {
		update(ny: typeof opt) {
			({ y = 0, x = 0, skala = 1, noll = 0.5, scroll = false } = ny);
			pa();
		},
		destroy() {
			cancelAnimationFrame(ram);
			removeEventListener('scroll', pa);
			removeEventListener('resize', pa);
		}
	};
}

// Växa: sätter --p (0–1) på noden medan den passerar skärmen, så att CSS kan skala en bild med scrollen.
export function vaxa(node: HTMLElement) {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	let ram = 0;
	const rita = () => {
		ram = 0;
		const r = node.getBoundingClientRect();
		const p = Math.min(1, Math.max(0, (innerHeight * 0.75 - r.top) / (innerHeight * 0.7)));
		node.style.setProperty('--p', p.toFixed(3));
	};
	const pa = () => {
		if (!ram) ram = requestAnimationFrame(rita);
	};
	rita();
	addEventListener('scroll', pa, { passive: true });
	addEventListener('resize', pa);
	return {
		destroy() {
			cancelAnimationFrame(ram);
			removeEventListener('scroll', pa);
			removeEventListener('resize', pa);
		}
	};
}
