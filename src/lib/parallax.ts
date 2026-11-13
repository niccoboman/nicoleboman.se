// Parallax: flyttar noden lite i takt med scrollen. y/x = hur mycket (andel av avståndet till nollpunkten).
// noll = var på skärmen (andel av höjden) noden står på sin vanliga plats; 0.5 = mitten.
// Gör ingenting för den som valt minskad rörelse.
export function parallax(node: HTMLElement, opt: { y?: number; x?: number; skala?: number; noll?: number } = {}) {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	let { y = 0, x = 0, skala = 1, noll = 0.5 } = opt;
	let ram = 0;
	const rita = () => {
		ram = 0;
		const r = node.getBoundingClientRect();
		const avstand = r.top + r.height / 2 - innerHeight * noll;
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
			({ y = 0, x = 0, skala = 1, noll = 0.5 } = ny);
			pa();
		},
		destroy() {
			cancelAnimationFrame(ram);
			removeEventListener('scroll', pa);
			removeEventListener('resize', pa);
		}
	};
}
