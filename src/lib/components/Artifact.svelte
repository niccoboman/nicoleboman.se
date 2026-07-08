<figure class="w-[clamp(150px,19vw,270px)]">
	<div class="artifact-img relative aspect-[3/3.9] overflow-hidden transition-[filter] duration-500 hover:contrast-[1.12] hover:saturate-[1.15]"></div>
</figure>

<style>
	.artifact-img {
		background:
			radial-gradient(120% 70% at 20% 12%, #26454d 0%, transparent 55%),
			radial-gradient(140% 90% at 80% 30%, #37535a 0%, transparent 60%),
			radial-gradient(120% 80% at 50% 78%, #c3401f 0%, transparent 58%),
			radial-gradient(100% 60% at 85% 96%, #e8c489 0%, transparent 55%),
			linear-gradient(175deg, #1d3940 0%, #55494a 46%, #b23a19 72%, #d99a54 100%);
	}
	.artifact-img::after {
		content: '';
		position: absolute;
		inset: -50%;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23g)'/></svg>");
		opacity: 0.5;
		mix-blend-mode: soft-light;
		animation: grain 1.2s steps(3) infinite;
	}
	@media (prefers-reduced-motion: reduce) {
		.artifact-img::after {
			animation: none;
		}
	}
</style>
