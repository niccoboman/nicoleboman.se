<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { page } from '$app/state';
	import { reveal } from '$lib/reveal';
	import { text, sprakFran, lank } from '$lib/i18n';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const sprak = $derived(sprakFran(page.params.lang));
	const g = $derived(text[sprak]);
	const t = $derived(g.start);

	// Orden som växlar efter "Jag är"/"I'm". Det första visas längst.
	const ord = $derived(t.ord);
	let i = $state(0);
	let forra = $state(-1);
	// Animationen kan pausas (WCAG 2.2.2). Står den still visas det första ordet.
	let pausad = $state(false);
	let rorelseTillaten = $state(false);
	let rotator: HTMLElement;
	let hero: HTMLElement;

	// Skala jättetexten så att det längsta ordet fyller hela bredden.
	// På smala skärmar får "Keynote speaker" bryta till två rader, så där räknas varje ord för sig.
	function bredd(text: string) {
		const s = document.createElement('span');
		s.textContent = text;
		s.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap';
		rotator.append(s);
		const b = s.scrollWidth;
		s.remove();
		return b;
	}
	function anpassa() {
		const smal = rotator.clientWidth < 700;
		const delar = smal ? ord.flatMap((o) => o.split(' ')) : ord;
		const langst = Math.max(...delar.map(bredd));
		const nu = parseFloat(getComputedStyle(rotator).fontSize);
		if (langst > 0) hero.style.setProperty('--hero', `${(0.99 * nu * rotator.clientWidth) / langst}px`);
	}

	// Byts språket: börja om på första ordet och räkna om storleken.
	$effect(() => {
		void sprak;
		i = 0;
		forra = -1;
		tick().then(anpassa);
	});

	onMount(() => {
		document.fonts.ready.then(anpassa);
		const ro = new ResizeObserver(anpassa);
		ro.observe(hero);
		return () => ro.disconnect();
	});

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		rorelseTillaten = true;
		let timer: ReturnType<typeof setTimeout>;
		const nasta = () => {
			timer = setTimeout(
				() => {
					// Byt inte ord när fliken är dold; animationen pausas ändå av webbläsaren.
					if (!document.hidden && !pausad) {
						forra = i;
						i = (i + 1) % ord.length;
					}
					nasta();
				},
				i === 0 ? 2800 : 1700
			);
		};
		nasta();
		return () => clearTimeout(timer);
	});

	const senaste = $derived(data.texter[0]);
	const tidigare = $derived(data.texter.slice(1));

	// Fyll på med { citat, vem } när det finns citat att visa. Tom lista = avsnittet döljs.
	const citat: { citat: string; vem: string }[] = [];
</script>

<svelte:head>
	<title>{t.titel}</title>
	<meta name="description" content={t.beskrivning} />
	<link rel="alternate" hreflang="en" href="https://www.nicoleboman.com/" />
	<link rel="alternate" hreflang="sv" href="https://www.nicoleboman.com/sv" />
</svelte:head>

<!-- Inledning -->
<section bind:this={hero} class="hero flex min-h-[68svh] md:min-h-[calc(100svh-44px)] flex-col [justify-content:safe_end] px-[clamp(16px,3vw,40px)] pb-6 pt-12">
	<h1 class="jatte text-svart leading-[0.9]">
		<span class="sr-only">{t.skarmlasare}</span>
		<span aria-hidden="true" class="block text-[length:var(--hero)]">{t.jagAr}</span>
		<span bind:this={rotator} aria-hidden="true" class="rotator block text-[length:var(--hero)]">
			{#each ord as o, n (o)}
				<span class="ord" class:aktiv={n === i} class:ut={n === forra}
					>{#each o.split(' ') as del, d (d)}{#if d > 0}{' '}{/if}<span class="whitespace-nowrap">{del}</span>{/each}</span
				>
			{/each}
		</span>
	</h1>
	<div class="mt-8 flex flex-wrap items-end justify-between gap-6 border-t-2 border-svart pt-4">
		<p class="max-w-[44ch] text-[clamp(1.05rem,1.4vw,1.3rem)] font-medium leading-[1.35]">
			{t.ingress}
		</p>
		<div class="flex items-center gap-6">
			{#if rorelseTillaten}
				<button
					type="button"
					onclick={() => (pausad = !pausad)}
					class="etikett streck inline-block cursor-pointer py-1.5 text-svart"
				>
					<span aria-hidden="true">{pausad ? '▶' : '❚❚'}</span>
					{pausad ? g.animation.spela : g.animation.pausa}
				</button>
			{/if}
			<a href="#om" class="etikett streck inline-block py-1.5 text-svart">{t.lasVidare}<span aria-hidden="true">&nbsp;↓</span></a>
		</div>
	</div>
</section>

<!-- Helbild -->
<figure class="mt-2">
	<img
		src="/bilder/scen-bw-2160.webp"
		srcset="/bilder/scen-bw-1200.webp 1200w, /bilder/scen-bw-2160.webp 2160w"
		sizes="100vw"
		alt={t.heroAlt}
		width="2160"
		height="1440"
		class="h-[min(92svh,66vw)] w-full object-cover object-[50%_30%] max-md:h-[56svh]"
	/>
</figure>

<!-- 01 Om -->
<section
	id="om"
	class="mt-[12vh] grid scroll-mt-6 gap-10 px-[clamp(16px,3vw,40px)] md:grid-cols-12 md:gap-8"
	use:reveal
>
	<figure class="reveal order-last md:order-none md:col-span-5">
		<img
			src="/bilder/publik-1600.webp"
			srcset="/bilder/publik-900.webp 900w, /bilder/publik-1600.webp 1600w"
			sizes="(min-width: 768px) 42vw, 100vw"
			alt={t.om.bildAlt}
			width="1600"
			height="2000"
			loading="lazy"
			class="aspect-[4/3] w-full object-cover object-[50%_25%] md:aspect-[4/5] md:object-center"
		/>
	</figure>
	<div class="reveal flex flex-col md:col-span-7 md:pl-[2vw]">
		<p class="etikett">{t.om.etikett}</p>
		<h2 class="jatte mt-4 text-[clamp(3rem,6.2vw,7.5rem)]">{t.om.rubrik}</h2>
		<div class="mt-8 max-w-[52ch] space-y-4 text-[1.15rem] leading-[1.6]">
			{#each t.om.stycken as stycke (stycke)}
				<p>{stycke}</p>
			{/each}
		</div>
		<a
			href={lank(sprak, '/om')}
			class="jatte mt-8 inline-block self-start border-b-4 border-svart text-[clamp(1.8rem,3vw,2.6rem)] text-svart no-underline transition-transform hover:translate-x-1"
			>{t.om.mer}<span aria-hidden="true">&nbsp;→</span></a
		>
	</div>
</section>

<!-- 02 Arbete -->
<section id="arbete" class="mt-[16vh] scroll-mt-6 px-[clamp(16px,3vw,40px)]" use:reveal>
	<p class="etikett reveal">{t.arbete.etikett}</p>
	<h2 class="jatte reveal mt-4 text-[clamp(2.6rem,5.5vw,6rem)]">{t.arbete.rubrik}</h2>
	<p class="reveal mt-5 max-w-[52ch] text-[clamp(1.1rem,1.4vw,1.3rem)] font-semibold leading-[1.4]">
		{t.arbete.studioFore}
		<a href="https://studiosten.se" target="_blank" rel="noopener noreferrer" class="underline decoration-2 underline-offset-4"
			>Studio Stén<span class="sr-only"> {g.nyFlik}</span></a
		>{t.arbete.studioEfter}
	</p>

	<ol class="mt-12 grid border-t-2 border-svart md:grid-cols-3">
		{#each t.arbete.poster as a, n (a.nr)}
			<li
				class="reveal flex flex-col gap-4 border-b border-svart py-8 transition-colors duration-300 md:border-b-0 md:px-6 md:py-10 {n >
				0
					? 'md:border-l'
					: 'md:pl-0'}"
			>
				<span class="etikett">{a.nr}</span>
				<h3 class="jatte text-[clamp(2.2rem,3.2vw,3.4rem)]">{a.titel}</h3>
				<p class="max-w-[38ch] text-[1.05rem] leading-[1.55]">{a.text}</p>
			</li>
		{/each}
	</ol>
	<a
		href="https://studiosten.se"
		target="_blank"
		rel="noopener noreferrer"
		class="etikett streck mt-8 inline-block py-1.5 text-svart">{t.arbete.boka}<span aria-hidden="true">&nbsp;↗</span><span class="sr-only"> {g.nyFlik}</span></a
	>
</section>

{#if citat.length}
	<section class="mt-[16vh] px-[clamp(16px,3vw,40px)]" use:reveal>
		<p class="etikett reveal">Röster</p>
		<div class="mt-10 grid gap-14 md:grid-cols-2">
			{#each citat as c (c.citat)}
				<blockquote class="reveal">
					<p class="text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold leading-[1.2] tracking-[-0.015em]">
						”{c.citat}”
					</p>
					<footer class="etikett mt-5 text-grafit">{c.vem}</footer>
				</blockquote>
			{/each}
		</div>
	</section>
{/if}

<!-- 03 Texter: eget läge – papper och serif, uppslag som i ett magasin -->
<section id="texter" class="mt-[16vh] scroll-mt-0 bg-papper py-[clamp(64px,12vh,140px)]" use:reveal>
	<div class="px-[clamp(16px,3vw,40px)]">
		<p class="etikett reveal">{t.texter.etikett}</p>
		<h2 class="jatte reveal mt-4 text-[clamp(2.6rem,5.5vw,6rem)]">{t.texter.rubrik}</h2>
		<p class="serif reveal mt-4 max-w-[44ch] text-[clamp(1.2rem,1.6vw,1.45rem)] italic leading-[1.4]">
			{t.texter.ingress}
		</p>

		<div class="mt-14 grid gap-12 border-t border-svart pt-10 md:grid-cols-12 md:gap-8">
			{#if senaste}
				<a
					href={senaste.extern ?? `/texter/${senaste.slug}`}
					target={senaste.extern ? '_blank' : undefined}
					rel={senaste.extern ? 'noopener noreferrer' : undefined}
					class="group reveal block text-svart no-underline md:col-span-7"
				>
					<span class="etikett text-grafit">{t.texter.senaste} · {senaste.ar}</span>
					<span class="serif mt-4 block text-[clamp(3rem,7vw,7rem)] italic leading-[0.95] tracking-[-0.02em]">
						<span lang={senaste.sprak}>{senaste.titel}</span>
					</span>
					{#if senaste.undertitel}
						<span class="serif mt-5 block text-[clamp(1.2rem,1.8vw,1.6rem)] leading-[1.35] text-svart/70">
							<span lang={senaste.sprak}>{senaste.undertitel}</span>
						</span>
					{/if}
					<span class="etikett mt-8 inline-block border-b-2 border-svart pb-1 transition-[border-width] group-hover:border-b-4"
						>{t.texter.las}<span aria-hidden="true">&nbsp;↗</span>{#if senaste.extern}<span class="sr-only"> {g.nyFlik}</span>{/if}</span
					>
				</a>
			{/if}

			<ul class="reveal md:col-span-5 md:border-l md:border-svart/25 md:pl-8">
				{#each tidigare as txt (txt.slug)}
					<li class="border-b border-svart/25 first:pt-0 last:border-b-0">
						<a
							href={txt.extern ?? `/texter/${txt.slug}`}
							target={txt.extern ? '_blank' : undefined}
							rel={txt.extern ? 'noopener noreferrer' : undefined}
							class="group block py-5 text-svart no-underline"
						>
							<span class="etikett text-grafit">{txt.ar}</span>
							<span class="serif mt-1 block text-[clamp(1.4rem,2vw,1.9rem)] italic leading-[1.15] transition-transform duration-300 group-hover:translate-x-1">
								<span lang={txt.sprak}>{txt.titel}</span>
								<span class="not-italic" aria-hidden="true">↗</span>{#if txt.extern}<span class="sr-only"> {g.nyFlik}</span>{/if}
							</span>
							{#if txt.undertitel}
								<span lang={txt.sprak} class="mt-1 block text-[0.98rem] leading-[1.45] text-svart/70">{txt.undertitel}</span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<a
			href="https://bomannicole.substack.com/"
			target="_blank"
			rel="noopener noreferrer"
			class="etikett streck mt-12 inline-block py-1.5 text-svart">{t.texter.prenumerera}<span aria-hidden="true">&nbsp;↗</span><span class="sr-only"> {g.nyFlik}</span></a
		>
	</div>
</section>

<style>
	/* Startvärde för jättetexten; anpassa() räknar sedan fram exakt storlek. */
	.hero {
		--hero: 12vw;
	}

	/* Alla ord ligger på samma plats. Det aktiva glider upp, det förra glider ut uppåt. */
	.rotator {
		position: relative;
		display: grid;
		overflow: hidden;
	}
	.ord {
		grid-area: 1 / 1;
		justify-self: start;
		white-space: nowrap;
		transform: translateY(105%);
	}
	@media (max-width: 767px) {
		.ord {
			white-space: normal;
		}
	}
	.ord.aktiv,
	.ord.ut {
		transition: transform 0.75s cubic-bezier(0.7, 0, 0.2, 1);
	}
	.ord.aktiv {
		transform: none;
	}
	.ord.ut {
		transform: translateY(-105%);
	}

	@media (prefers-reduced-motion: reduce) {
		.ord.aktiv,
		.ord.ut {
			transition: none;
		}
	}
</style>
