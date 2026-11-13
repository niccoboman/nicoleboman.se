<script lang="ts">
		import { page } from '$app/state';
	import { reveal } from '$lib/reveal';
	import { parallax } from '$lib/parallax';
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
	<link rel="alternate" hreflang="en" href="https://www.nicoleboman.com/" />
	<link rel="alternate" hreflang="sv" href="https://www.nicoleboman.com/sv" />
</svelte:head>

<!-- Rubriken finns för skärmläsare och sökmotorer; sidan börjar visuellt med bilden. -->
<h1 class="sr-only">{t.skarmlasare}</h1>

<!-- Helbild, med marginal som på en tidningssida -->
<figure class="mt-6 px-[clamp(16px,3vw,40px)]">
	<div class="overflow-hidden">
	<img
		use:parallax={{ y: 0.12, skala: 1.14 }}
		src="/bilder/scen-bw-2160.webp"
		srcset="/bilder/scen-bw-1200.webp 1200w, /bilder/scen-bw-2160.webp 2160w"
		sizes="100vw"
		alt={t.heroAlt}
		width="2160"
		height="1440"
		class="h-[min(86svh,62vw)] w-full object-cover object-[50%_30%] max-md:h-[56svh]"
	/>
	</div>
</figure>

<!-- 01 Om: text i mitten, bilder utspridda runt -->
<section id="om" class="relative mt-[18vh] scroll-mt-6 px-[clamp(16px,3vw,40px)]" use:reveal>
	<div class="flex items-baseline gap-8">
		<p class="etikett reveal shrink-0">{t.om.etikett}</p>
		<h2 class="jatte upp text-[clamp(2.8rem,5.6vw,6.5rem)]">{t.om.rubrik}</h2>
	</div>

	<div class="mt-[10vh] grid gap-10 md:grid-cols-12 md:gap-6">
		<figure class="md:col-span-3 md:mt-[22vh]" use:parallax={{ y: 0.1 }}>
			<div class="bild">
			<img
				src="/bilder/profil-900.webp"
				alt={g.om.bildAlt}
				width="900"
				height="600"
				loading="lazy"
				class="aspect-[4/5] w-full object-cover object-[60%_40%]"
			/>
			</div>
		</figure>
		<div class="reveal md:col-span-6 md:px-[2vw]">
			<p class="ingress text-[clamp(1.7rem,2.7vw,2.6rem)] leading-[1.18]">
				<span class="sr-only">{t.om.stycken[0]}</span>
				<span aria-hidden="true" class="ord-in"
					><span style="--i:0" class="mr-2 text-grafit">“</span>{#each t.om.stycken[0].split(' ') as o, n (n)}<span style="--i:{n + 1}">{o}</span>{' '}{/each}</span
				>
			</p>
			<p class="ingress mt-8 text-grafit">{t.om.stycken[1]}</p>
			<a href={lank(sprak, '/om')} class="ingress mt-10 inline-block border-b border-svart text-svart no-underline transition-transform hover:translate-x-1"
				><span aria-hidden="true">→&nbsp;</span>{t.om.mer}</a
			>
		</div>
		<figure class="md:col-span-3 max-md:ml-auto max-md:w-3/4" use:parallax={{ y: -0.08 }}>
			<div class="bild">
			<img
				src="/bilder/publik-900.webp"
				srcset="/bilder/publik-900.webp 900w, /bilder/publik-1600.webp 1600w"
				sizes="(min-width: 768px) 24vw, 75vw"
				alt={t.om.bildAlt}
				width="900"
				height="1125"
				loading="lazy"
				class="aspect-[4/5] w-full object-cover"
			/>
			</div>
		</figure>
	</div>
</section>

<!-- 02 Arbete -->
<section id="arbete" class="mt-[20vh] scroll-mt-6 px-[clamp(16px,3vw,40px)]" use:reveal>
	<div class="flex items-baseline gap-8">
		<p class="etikett reveal shrink-0">{t.arbete.etikett}</p>
		<h2 class="jatte upp text-[clamp(2.8rem,5.6vw,6.5rem)]">{t.arbete.rubrik}</h2>
	</div>
	<p class="ingress reveal mt-6 max-w-[40ch]">
		{t.arbete.studioFore}
		<a href="https://studiosten.se" target="_blank" rel="noopener noreferrer" class="underline decoration-1 underline-offset-4"
			>Studio Stén<span class="sr-only"> {g.nyFlik}</span></a
		>{t.arbete.studioEfter}
	</p>

	<ol class="mt-14 grid border-t border-linje md:grid-cols-3">
		{#each t.arbete.poster as a, n (a.nr)}
			<li
				class="reveal flex flex-col gap-4 border-b border-linje py-8 md:border-b-0 md:px-6 md:py-10 {n > 0 ? 'md:border-l' : 'md:pl-0'}"
			>
				<span class="etikett text-grafit">{a.nr}</span>
				<h3 class="jatte text-[clamp(2.2rem,3vw,3.2rem)]">{a.titel}</h3>
				<p class="max-w-[38ch] text-[1.02rem] leading-[1.6] text-grafit">{a.text}</p>
			</li>
		{/each}
	</ol>
	<a
		href="https://studiosten.se"
		target="_blank"
		rel="noopener noreferrer"
		class="ingress mt-8 inline-block border-b border-svart text-svart no-underline"
		><span aria-hidden="true">→&nbsp;</span>{t.arbete.boka}<span class="sr-only"> {g.nyFlik}</span></a
	>
</section>

<!-- 03 Coachning 1:1 (bokas via Studio Stén) -->
<section id="coachning" class="mt-[20vh] scroll-mt-6 px-[clamp(16px,3vw,40px)]" use:reveal>
	<div class="grid gap-8 md:grid-cols-12">
		<p class="etikett reveal md:col-span-3">{t.coachning.etikett}</p>
		<div class="md:col-span-9">
			<h2 class="jatte upp max-w-[16ch] text-[clamp(2.8rem,5.6vw,6.5rem)]">{t.coachning.rubrik}</h2>
			<p class="ingress reveal mt-6 max-w-[40ch]">{t.coachning.text}</p>
			<p class="etikett reveal mt-6 text-grafit">{t.coachning.kort}</p>
			<a
				href="https://studiosten.se/coachning"
				target="_blank"
				rel="noopener noreferrer"
				class="ingress reveal mt-8 inline-block border-b border-svart text-svart no-underline"
				><span aria-hidden="true">→&nbsp;</span>{t.coachning.boka}<span class="sr-only"> {g.nyFlik}</span></a
			>
		</div>
	</div>
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
