// Scroll-reveal: sätter data-inview på noden första gången den syns.
// Låg tröskel + marginal så att även höga avsnitt aktiveras i tid.
// Visas även direkt om någon tabbar in i avsnittet med tangentbordet.
export function reveal(node: HTMLElement) {
	const visa = () => {
		node.dataset.inview = '';
		io.disconnect();
		node.removeEventListener('focusin', visa);
	};
	const io = new IntersectionObserver(
		(entries) => {
			if (entries.some((e) => e.isIntersecting)) visa();
		},
		{ threshold: 0, rootMargin: '0px 0px -12% 0px' }
	);
	io.observe(node);
	node.addEventListener('focusin', visa);
	return {
		destroy() {
			io.disconnect();
			node.removeEventListener('focusin', visa);
		}
	};
}
