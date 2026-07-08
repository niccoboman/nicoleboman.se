// Scroll-reveal: sätter 'inview' på noden första gången den syns.
export function reveal(node: HTMLElement) {
	const io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				if (e.isIntersecting) {
					node.classList.add('inview');
					io.disconnect();
				}
			}
		},
		{ threshold: 0.2 }
	);
	io.observe(node);
	return {
		destroy() {
			io.disconnect();
		}
	};
}
