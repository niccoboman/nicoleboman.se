<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { reveal } from '$lib/reveal';
	import { parallax } from '$lib/parallax';
	import { text, sprakFran, lank } from '$lib/i18n';

	let { children } = $props();

	const isHub = $derived(page.url.pathname.startsWith('/hub'));

	const sprak = $derived(sprakFran(page.params.lang));
	const t = $derived(text[sprak]);

	const nav = $derived([
		{ href: lank(sprak, '/om'), label: t.nav.om },
		{ href: lank(sprak, '/#arbete'), label: t.nav.arbete },
		{ href: lank(sprak, '/#kontakt'), label: t.nav.kontakt }
	]);

	// Samma sida på det andra språket: /om <-> /sv/om
	const andraSprak = $derived.by(() => {
		const sti = page.url.pathname;
		if (sprak === 'sv') return sti.replace(/^\/sv/, '') || '/';
		return page.params.lang === undefined && page.route.id?.startsWith('/[[lang=sv]]') ? lank('sv', sti) : '/sv';
	});

	// Ljust/mörkt läge. Startläget sätts redan i app.html; här läser vi av det och låter besökaren byta.
	let mork = $state(false);
	onMount(() => {
		mork = document.documentElement.dataset.tema === 'mork';
	});
	function vaxlaTema() {
		mork = !mork;
		if (mork) document.documentElement.dataset.tema = 'mork';
		else delete document.documentElement.dataset.tema;
		try {
			localStorage.setItem('tema', mork ? 'mork' : 'ljus');
		} catch {}
	}

	// Mobilmenyn: lås sidan bakom, flytta fokus in och tillbaka till knappen när den stängs.
	let menyOppen = $state(false);
	let menyKnapp = $state<HTMLButtonElement>();
	let stangKnapp = $state<HTMLButtonElement>();
	function stangMeny() {
		menyOppen = false;
		// Lås upp direkt, innan länkens hopp körs, annars scrollar sidan inte dit.
		document.documentElement.style.overflow = '';
		menyKnapp?.focus({ preventScroll: true });
	}
	$effect(() => {
		document.documentElement.style.overflow = menyOppen ? 'hidden' : '';
		if (menyOppen) stangKnapp?.focus();
	});

	// Lägg till TikTok, YouTube m.m. här när kanalerna finns.
	const kanaler = [
		{ href: 'https://www.linkedin.com/in/nicole-boman/', label: 'LinkedIn' },
		{ href: 'https://bomannicole.substack.com/', label: 'Substack' }
	];
</script>

<svelte:head>
	{#if !isHub}
		<!-- Delningsbild för LinkedIn, Slack m.m. Titel och beskrivning sätts per sida. -->
		<meta property="og:type" content="website" />
		<meta property="og:site_name" content="Nicole Boman" />
		<meta property="og:url" content={`https://www.nicoleboman.com${page.url.pathname}`} />
		<meta property="og:image" content="https://www.nicoleboman.com/og.jpg" />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta property="og:image:alt" content={t.ogAlt} />
		<meta name="twitter:card" content="summary_large_image" />
	{/if}
</svelte:head>

{#if isHub}
	{@render children()}
{:else}
	<div class="font-arkiv">
		<a
			href="#innehall"
			class="etikett sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-svart focus:px-3 focus:py-2 focus:text-krita"
			>{t.hoppa}</a
		>

		<header class="flex items-center justify-between gap-x-6 px-[clamp(16px,3vw,40px)] pt-5">
			<a href={lank(sprak, '/')} class="etikett inline-block whitespace-nowrap py-1.5 text-svart no-underline">Nicole Boman</a>

			<!-- Mobil: en knapp som öppnar en helskärmsmeny -->
			<button
				bind:this={menyKnapp}
				type="button"
				onclick={() => (menyOppen = true)}
				aria-expanded={menyOppen}
				aria-controls="mobilmeny"
				class="etikett streck inline-block cursor-pointer py-1.5 text-svart md:hidden">{t.meny.oppna}</button
			>

			<!-- Desktop: allt på en rad -->
			<nav aria-label={t.huvudmeny} class="ml-auto hidden gap-x-[clamp(14px,2.4vw,32px)] md:flex">
				{#each nav as l (l.href)}
					<a href={l.href} class="etikett streck inline-block py-1.5 text-svart">{l.label}</a>
				{/each}
			</nav>
			<div class="hidden items-center gap-[clamp(14px,2.4vw,32px)] md:flex">
				<!-- Knappens text säger vad som händer, så att synlig text och uppläst namn är samma -->
				<button
					type="button"
					onclick={vaxlaTema}
					class="etikett streck inline-block cursor-pointer whitespace-nowrap py-1.5 text-svart"
				>
					{mork ? t.tema.tillLjus : t.tema.tillMork}
				</button>
				<a
					href={andraSprak}
					hreflang={t.sprakbyte.lang}
					lang={t.sprakbyte.lang}
					class="etikett inline-block border border-svart px-2 py-1 text-svart no-underline transition-colors hover:bg-svart hover:text-krita"
					>{t.sprakbyte.etikett}<span class="sr-only"> – {t.sprakbyte.namn}</span></a
				>
			</div>
		</header>

		{#if menyOppen}
			<div
				id="mobilmeny"
				role="dialog"
				aria-modal="true"
				aria-label={t.huvudmeny}
				tabindex="-1"
				onkeydown={(e) => e.key === 'Escape' && stangMeny()}
				class="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-krita px-[clamp(16px,3vw,40px)] pb-8 pt-5 md:hidden"
			>
				<div class="flex items-center justify-between">
					<a href={lank(sprak, '/')} onclick={stangMeny} class="etikett inline-block py-1.5 text-svart no-underline">Nicole Boman</a>
					<button bind:this={stangKnapp} type="button" onclick={stangMeny} class="etikett streck inline-block cursor-pointer py-1.5 text-svart"
						>{t.meny.stang}</button
					>
				</div>
				<nav aria-label={t.huvudmeny} class="mt-auto">
					<ul>
						{#each nav as l (l.href)}
							<li>
								<a href={l.href} onclick={stangMeny} class="jatte block py-1 text-[clamp(3.2rem,16vw,6rem)] leading-[1.05] text-svart no-underline"
									>{l.label}</a
								>
							</li>
						{/each}
					</ul>
				</nav>
				<div class="mt-12 flex items-center justify-between border-t border-svart pt-5">
					<button type="button" onclick={vaxlaTema} class="etikett streck inline-block cursor-pointer py-1.5 text-svart">
						{mork ? t.tema.tillLjus : t.tema.tillMork}
					</button>
					<a
						href={andraSprak}
						onclick={stangMeny}
						hreflang={t.sprakbyte.lang}
						lang={t.sprakbyte.lang}
						class="etikett inline-block border border-svart px-2 py-1 text-svart no-underline"
						>{t.sprakbyte.etikett}<span class="sr-only"> – {t.sprakbyte.namn}</span></a
					>
				</div>
			</div>
		{/if}

		<main id="innehall" tabindex="-1" class="outline-none">
			{@render children()}
		</main>

		<!-- Kontakt: svart fot med en jättestor blek rubrik i bakgrunden -->
		<footer id="kontakt" class="relative mt-[20vh] scroll-mt-0 overflow-hidden bg-svart text-krita" use:reveal>
			<div class="relative z-10 px-[clamp(16px,3vw,40px)] pt-[clamp(64px,12vh,140px)]">
				<div class="grid gap-10 md:grid-cols-12 md:gap-8">
					<figure class="bild md:col-span-3 max-md:w-1/2">
						<img
							src="/bilder/publik-900.webp"
							alt=""
							width="900"
							height="1125"
							loading="lazy"
							class="aspect-[3/4] w-full object-cover"
						/>
					</figure>
					<div class="md:col-span-6 md:col-start-5">
						<p class="etikett reveal text-krita/75">{t.kontakt.etikett}</p>
						<h2 class="jatte upp mt-4 text-[clamp(2.8rem,5vw,5.5rem)]">{t.kontakt.rubrik[0]} {t.kontakt.rubrik[1]}</h2>
						<p class="ingress reveal mt-6 max-w-[34ch] text-krita/85">
							{t.kontakt.text}
						</p>
						<p class="etikett reveal mt-6 text-krita/75">{t.kontakt.sprakResor}</p>
						<a
							href="https://www.linkedin.com/in/nicole-boman/"
							target="_blank"
							rel="noopener noreferrer"
							class="ingress reveal mt-10 inline-block border-b border-krita text-krita no-underline transition-transform hover:translate-x-1"
							><span aria-hidden="true">→&nbsp;</span>{t.kontakt.linkedin}<span class="sr-only"> {t.nyFlik}</span></a
						>
						<ul class="reveal mt-8 flex flex-wrap gap-x-8 gap-y-3">
							{#each kanaler.filter((k) => k.label !== 'LinkedIn') as k (k.href)}
								<li>
									<a href={k.href} target="_blank" rel="noopener noreferrer" class="etikett streck inline-block py-1.5 text-krita"
										>{k.label}<span aria-hidden="true">&nbsp;↗</span><span class="sr-only"> {t.nyFlik}</span></a
									>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
			<!-- Dekor: samma rubrik, jättestor och blek. Döljs för skärmläsare. -->
			<p aria-hidden="true" use:parallax={{ x: -0.3, noll: 0.8 }} class="jatte pointer-events-none mt-[6vh] select-none whitespace-nowrap px-[clamp(8px,1vw,16px)] text-[clamp(5rem,19vw,22rem)] leading-[0.8] text-krita/[0.07]">
				{t.kontakt.rubrik[0]} {t.kontakt.rubrik[1]}
			</p>
			<div class="relative z-10 flex flex-wrap justify-between gap-4 px-[clamp(16px,3vw,40px)] pb-6 pt-5">
				<span class="etikett text-krita/75">© {new Date().getFullYear()} Nicole Boman · {t.kontakt.sverige}</span>
				<span class="etikett text-krita/75">{t.kontakt.foto}</span>
			</div>
		</footer>
	</div>
{/if}
