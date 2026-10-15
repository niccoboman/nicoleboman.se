<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { reveal } from '$lib/reveal';
	import Kontakt from '$lib/components/Kontakt.svelte';
	import { text, sprakFran, lank } from '$lib/i18n';

	let { children } = $props();

	const isAdmin = $derived(page.url.pathname.startsWith('/admin'));

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

	// Lägg till TikTok, YouTube m.m. här när kanalerna finns.
	const kanaler = [
		{ href: 'https://www.linkedin.com/in/nicoleboman/', label: 'LinkedIn' },
		{ href: 'https://bomannicole.substack.com/', label: 'Substack' }
	];
</script>

{#if isAdmin}
	{@render children()}
{:else}
	<div class="font-arkiv">
		<a
			href="#innehall"
			class="etikett sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-svart focus:px-3 focus:py-2 focus:text-krita"
			>{t.hoppa}</a
		>

		<header class="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-[clamp(16px,3vw,40px)] pt-5">
			<a href={lank(sprak, '/')} class="etikett inline-block whitespace-nowrap py-1.5 text-svart no-underline">Nicole Boman</a>
			<!-- Mobil: namn + knappar på första raden, menyn på egen rad. Desktop: allt på en rad. -->
			<nav
				aria-label={t.huvudmeny}
				class="order-3 flex w-full flex-wrap gap-x-[clamp(14px,2.4vw,32px)] md:order-none md:ml-auto md:w-auto"
			>
				{#each nav as l (l.href)}
					<a href={l.href} class="etikett streck inline-block py-1.5 text-svart">{l.label}</a>
				{/each}
			</nav>
			<div class="flex items-center gap-[clamp(14px,2.4vw,32px)]">
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

		<main id="innehall" tabindex="-1" class="outline-none">
			{@render children()}
		</main>

		<footer id="kontakt" class="mt-[16vh] scroll-mt-0 bg-svart text-krita" use:reveal>
			<div class="px-[clamp(16px,3vw,40px)] pb-6 pt-[clamp(64px,12vh,140px)]">
				<div class="grid gap-12 md:grid-cols-12">
					<div class="md:col-span-5">
						<p class="etikett reveal text-krita/75">{t.kontakt.etikett}</p>
						<h2 class="jatte reveal mt-6 text-[clamp(3.2rem,7vw,8rem)]">{t.kontakt.rubrik[0]}{' '}<br />{t.kontakt.rubrik[1]}</h2>
						<p class="reveal mt-8 max-w-[34ch] text-[1.15rem] leading-[1.5] text-krita/85">
							{t.kontakt.text}
						</p>
						<ul class="reveal mt-8 flex flex-wrap gap-x-8 gap-y-3">
							{#each kanaler as k (k.href)}
								<li>
									<a href={k.href} target="_blank" rel="noopener noreferrer" class="etikett streck inline-block py-1.5 text-krita"
										>{k.label}<span aria-hidden="true">&nbsp;↗</span><span class="sr-only"> {t.nyFlik}</span></a
									>
								</li>
							{/each}
						</ul>
					</div>
					<div class="reveal md:col-span-6 md:col-start-7 md:pt-12">
						<Kontakt {sprak} />
					</div>
				</div>
				<div class="mt-[12vh] flex flex-wrap justify-between gap-4 border-t border-krita/30 pt-5">
					<span class="etikett text-krita/75">© {new Date().getFullYear()} Nicole Boman · {t.kontakt.sverige}</span>
					<span class="etikett text-krita/75">{t.kontakt.foto}</span>
				</div>
			</div>
		</footer>
	</div>
{/if}
