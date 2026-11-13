<script lang="ts">
	import { page } from '$app/state';
	import { reveal } from '$lib/reveal';
	import { flyg } from '$lib/flyg';
	import { text, sprakFran, lank } from '$lib/i18n';

	const sprak = $derived(sprakFran(page.params.lang));
	const g = $derived(text[sprak]);
	const t = $derived(g.start);

	// Fyll på med { citat, vem } när det finns citat att visa. Tom lista = avsnittet döljs.
	const citat: { citat: string; vem: string }[] = [];
</script>

<svelte:head>
	<title>{t.titel}</title>
	<meta name="description" content={t.beskrivning} />
	<meta property="og:title" content={t.titel} />
	<meta property="og:description" content={t.beskrivning} />
	<link rel="alternate" hreflang="en" href="https://www.nicoleboman.com/" />
	<link rel="alternate" hreflang="sv" href="https://www.nicoleboman.com/sv" />
</svelte:head>

<!-- Inledning: namnet och titlarna till vänster, porträttet till höger -->
<section class="grid min-h-[calc(100svh-64px)] gap-10 px-[clamp(16px,3vw,40px)] pb-8 pt-[clamp(24px,6vh,72px)] md:grid-cols-12 md:gap-8">
	<div class="flex flex-col md:col-span-7">
		<p class="etikett text-grafit start-in">
			{#each t.roller as r, n (r)}{#if n > 0}<span class="mx-2 text-rod" aria-hidden="true">·</span>{/if}{r}{/each}
		</p>
		<h1 class="jatte start-in mt-auto pt-16 text-[clamp(4.2rem,10.5vw,11.5rem)] leading-[0.92]" style="animation-delay:0.1s">
			<!-- Namnet glider ner i meningen "Jag är Nicole …" när man scrollar -->
			<span class="relative z-20 inline-block" use:flyg={sprak}>Nicole</span><br /><em>Boman</em><span class="sr-only"> – {t.titlar}</span>
		</h1>
		<ul class="start-in mt-10 flex gap-x-6" style="animation-delay:0.2s">
			<li><a href="https://www.linkedin.com/in/nicole-boman/" target="_blank" rel="noopener noreferrer" class="etikett streck inline-block py-1.5 text-svart">LinkedIn<span class="sr-only"> {g.nyFlik}</span></a></li>
			<li><a href="https://bomannicole.substack.com/" target="_blank" rel="noopener noreferrer" class="etikett streck inline-block py-1.5 text-svart">Substack<span class="sr-only"> {g.nyFlik}</span></a></li>
		</ul>
	</div>
	<figure class="start-in md:col-span-5 md:col-start-8" style="animation-delay:0.15s">
		<img
			src="/bilder/scen-bw-1200.webp"
			srcset="/bilder/scen-bw-1200.webp 1200w, /bilder/scen-bw-2160.webp 2160w"
			sizes="(min-width: 768px) 40vw, 100vw"
			alt={t.heroAlt}
			width="1200"
			height="800"
			fetchpriority="high"
			class="aspect-[4/5] w-full object-cover object-[50%_30%] md:aspect-auto md:h-[calc(100svh-64px-clamp(24px,6vh,72px)-2rem)]"
		/>
	</figure>
</section>

<!-- Om: porträttet och introt -->
<section id="om" class="mt-[18vh] scroll-mt-6 px-[clamp(16px,3vw,40px)]" use:reveal>
	<p class="etikett reveal text-grafit">{t.om.etikett}</p>
	<div class="mt-8 grid gap-10 md:grid-cols-12 md:gap-8">
		<figure class="bild md:col-span-5">
			<img
				src="/bilder/portratt-900.webp"
				srcset="/bilder/portratt-900.webp 900w, /bilder/portratt-1600.webp 1600w"
				sizes="(min-width: 768px) 40vw, 100vw"
				alt={t.om.portrattAlt}
				width="900"
				height="1350"
				loading="lazy"
				decoding="async"
				class="aspect-[4/5] w-full object-cover object-[50%_20%]"
			/>
		</figure>
		<div class="flex flex-col md:col-span-6 md:col-start-7">
			<p class="jatte ord-in text-[clamp(2rem,3.4vw,3.4rem)] leading-[1.12]">
				<span class="sr-only">{t.intro}</span>
				<span aria-hidden="true"
					>{#each t.intro.split(' ') as o, n (n)}<span data-namn-mal={o === 'Nicole' ? '' : undefined}>{o}</span>{' '}{/each}</span
				>
			</p>
			<p class="ingress reveal mt-12">{t.om.stycken[0]}</p>
			<p class="ingress reveal mt-5 text-grafit"><em>{t.om.stycken[1]}</em></p>
		</div>
	</div>
</section>

<!-- Arbete -->
<section id="arbete" class="mt-[22vh] scroll-mt-6 px-[clamp(16px,3vw,40px)]" use:reveal>
	<p class="etikett reveal text-grafit">{t.arbete.etikett}</p>
	<div class="mt-6 grid gap-6 md:grid-cols-12 md:items-end md:gap-8">
		<h2 class="jatte upp text-[clamp(2.6rem,5vw,5.5rem)] md:col-span-7">{t.arbete.rubrik}</h2>
		<p class="ingress reveal md:col-span-4 md:col-start-9">
			{t.arbete.studioFore}
			<a href="https://studiosten.se" target="_blank" rel="noopener noreferrer" class="lank">Studio Stén<span class="sr-only"> {g.nyFlik}</span></a>{t.arbete.studioEfter}
		</p>
	</div>

	<ul class="mt-10 grid gap-x-8 md:grid-cols-2 lg:grid-cols-4">
		{#each t.arbete.poster as a (a.nr)}
			<li class="reveal flex flex-col gap-3 border-t border-linje pb-10 pt-6">
				<h3 class="jatte text-[clamp(1.9rem,2.4vw,2.6rem)]">{a.titel}</h3>
				<p class="max-w-[40ch] text-[0.98rem] leading-[1.7] text-grafit">{a.text}</p>
			</li>
		{/each}
		<!-- Coachning 1:1 bokas direkt, därför en egen länk -->
		<li id="coachning" class="reveal flex scroll-mt-6 flex-col gap-3 border-t border-linje pb-10 pt-6">
			<h3 class="jatte text-[clamp(1.9rem,2.4vw,2.6rem)]">{t.coachning.etikett}</h3>
			<p class="max-w-[40ch] text-[0.98rem] leading-[1.7] text-grafit">{t.coachning.text}</p>
			<p class="etikett text-grafit">{t.coachning.kort}</p>
			<p class="mt-auto pt-2">
				<a href="https://studiosten.se/coachning" target="_blank" rel="noopener noreferrer" class="lank">{t.coachning.boka}<span class="sr-only"> {g.nyFlik}</span></a>
			</p>
		</li>
	</ul>
	<p class="reveal mt-2">
		<a href="https://studiosten.se" target="_blank" rel="noopener noreferrer" class="ingress lank">{t.arbete.boka}<span class="sr-only"> {g.nyFlik}</span></a>
	</p>
</section>

{#if citat.length}
	<section class="mt-[16vh] px-[clamp(16px,3vw,40px)]" use:reveal>
		<p class="etikett reveal">Röster</p>
		<div class="mt-10 grid gap-14 md:grid-cols-2">
			{#each citat as c (c.citat)}
				<blockquote class="reveal">
					<p class="text-[clamp(1.5rem,2.6vw,2.2rem)] font-serif leading-[1.2]">
						”{c.citat}”
					</p>
					<footer class="etikett mt-5 text-grafit">{c.vem}</footer>
				</blockquote>
			{/each}
		</div>
	</section>
{/if}

<style>
	/* Inledningen tonar in när sidan laddas */
	:global(.js) .start-in {
		animation: start-in 1.2s ease both;
	}
	@keyframes start-in {
		from {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		:global(.js) .start-in {
			animation: none;
		}
	}
</style>
