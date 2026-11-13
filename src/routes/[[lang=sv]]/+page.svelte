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

<!-- Inledning: namnet i två delar och två bilder -->
<section class="relative flex min-h-[calc(100svh-56px)] flex-col overflow-x-clip px-[clamp(16px,3vw,40px)] pb-6">
	<div class="flex items-end justify-end gap-[clamp(10px,1.4vw,20px)] pt-[clamp(32px,7vh,90px)]">
		<figure class="w-[clamp(120px,15vw,230px)]">
			<p class="ingress mb-3 text-[1.15rem]">{t.hej}</p>
			<div class="bild-start overflow-hidden">
				<img
					src="/bilder/profil-900.webp"
					alt={g.om.bildAlt}
					width="900"
					height="600"
					class="aspect-[4/5] w-full object-cover object-[60%_40%]"
				/>
			</div>
		</figure>
		<figure class="w-[clamp(150px,21vw,330px)]">
			<div class="bild-start overflow-hidden" style="animation-delay:0.15s">
				<img
					src="/bilder/publik-900.webp"
					srcset="/bilder/publik-900.webp 900w, /bilder/publik-1600.webp 1600w"
					sizes="21vw"
					alt={t.om.bildAlt}
					width="900"
					height="1125"
					class="aspect-[2/3] w-full object-cover"
				/>
			</div>
		</figure>
	</div>

	<h1 class="jatte relative z-20 mt-[clamp(-14vw,-11vw,-40px)] text-[clamp(5.5rem,19vw,20rem)] leading-[0.82] max-md:mt-8">
		<span class="namn block"><span class="inline-block" use:flyg>Nicole</span></span>
		<span class="namn block pl-[38%] max-md:pl-[22%]">Boman</span>
		<span class="sr-only"> – {t.titlar}</span>
	</h1>

	<div class="mt-auto flex items-end justify-between gap-6 pt-8">
		<ul class="flex flex-wrap gap-x-5 gap-y-1">
			<li><a href="https://www.linkedin.com/in/nicole-boman/" target="_blank" rel="noopener noreferrer" class="etikett streck inline-block py-1.5 text-svart">LinkedIn<span class="sr-only"> {g.nyFlik}</span></a></li>
			<li><a href="https://bomannicole.substack.com/" target="_blank" rel="noopener noreferrer" class="etikett streck inline-block py-1.5 text-svart">Substack<span class="sr-only"> {g.nyFlik}</span></a></li>
		</ul>
	</div>
</section>

<!-- 01 Om: scenbilden till vänster, namnet landar i meningen bredvid -->
<section id="om" class="relative mt-[16vh] scroll-mt-6 px-[clamp(16px,3vw,40px)]" use:reveal>
	<p class="etikett reveal text-right">{t.om.etikett}</p>
	<div class="relative mt-4">
		<figure class="relative z-10 float-left mr-6 aspect-[3/2] w-[32%] max-md:mb-4 max-md:float-none max-md:w-full">
			<div>
				<img
					src="/bilder/scen-bw-2160.webp"
					srcset="/bilder/scen-bw-1200.webp 1200w, /bilder/scen-bw-2160.webp 2160w"
					sizes="(min-width: 768px) 32vw, 100vw"
					alt={t.heroAlt}
					width="1200"
					height="800"
					loading="lazy"
					decoding="async"
					class="aspect-[3/2] w-full object-cover object-[50%_30%]"
				/>
			</div>
		</figure>
		<p class="ingress intro pt-[calc(32%*0.6667-1.05em)] indent-[calc(19%+1rem)] text-[clamp(2rem,4.2vw,4.4rem)] leading-[1.08] max-md:indent-0 max-md:pt-0">
			<span class="sr-only">{t.intro}</span>
			<span aria-hidden="true" class="ord-in"
				>{#each t.intro.split(' ') as o, n (n)}<span style="--i:{n}" data-namn-mal={o === 'Nicole' ? '' : undefined}>{o}</span>{' '}{/each}</span
			>
		</p>
		<div class="clear-both grid gap-8 pt-10 md:grid-cols-12">
			<p class="ingress reveal md:col-span-5">{t.om.stycken[0]}</p>
			<div class="md:col-span-6 md:col-start-7">
				<p class="ingress reveal text-grafit">{t.om.stycken[1]}</p>
				<a href={lank(sprak, '/om')} class="ingress reveal mt-8 inline-block border-b border-svart text-svart no-underline transition-transform hover:translate-x-1"
					><span aria-hidden="true">→&nbsp;</span>{t.om.mer}</a
				>
			</div>
		</div>
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

<style>
	/* Bilderna i inledningen rullas fram när sidan laddas */
	:global(.js) .bild-start {
		animation: bild-in 1.4s cubic-bezier(0.7, 0, 0.2, 1) 0.2s both;
	}
	@keyframes bild-in {
		from {
			clip-path: inset(100% 0 0 0);
		}
		to {
			clip-path: inset(0);
		}
	}

	/* Namnet glider upp när sidan laddas */
	:global(.js) .namn {
		/* backwards: klippningen släpps när animationen är klar, annars klipps namnet när det flyger ner */
		animation: namn-in 1.3s cubic-bezier(0.7, 0, 0.2, 1) backwards;
	}
	:global(.js) .namn + .namn {
		animation-delay: 0.12s;
	}
	@keyframes namn-in {
		from {
			clip-path: inset(100% -0.2em -0.35em -0.2em);
			translate: 0 0.4em;
		}
		to {
			clip-path: inset(-0.35em -0.2em -0.35em -0.2em);
			translate: 0 0;
		}
	}

	/* Indraget gäller bara första raden, inte varje ord */
	.intro :global(.ord-in > span) {
		text-indent: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.js) .bild-start,
		:global(.js) .namn {
			animation: none;
		}
	}
</style>
