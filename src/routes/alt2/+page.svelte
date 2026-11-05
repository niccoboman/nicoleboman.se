<script lang="ts">
	// Skiss "Flöde": två idéer och inget annat.
	// 1. Avsikt först. En fråga under namnet. Svaret ordnar om sidan så att det du kom för ligger överst.
	//    Resten finns kvar under. Valet syns i adressen (?for=...) och fungerar som vanliga länkar utan JS.
	// 2. Sidan rör sig som film. Ett fast foto bredvid texten tonar långsamt över till nästa när du läser vidare,
	//    och varje foto glider in en aning medan det syns. Bara opacitet och skala, inget annat rör sig.
	import { text } from '$lib/i18n';
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';
	import { tick } from 'svelte';
	import { flip } from 'svelte/animate';
	import { paletter, valjPalett } from '$lib/paletter';

	const t = text.sv;
	const [namn, ...roller] = t.start.ord;
	const [keynotes, utbildning, radgivning] = t.start.arbete.poster;
	const utanNummer = (s: string) => s.split(' — ').pop() ?? s;

	const LINKEDIN = 'https://www.linkedin.com/in/nicole-boman/';
	const SUBSTACK = 'https://bomannicole.substack.com/';
	const COACHNING = 'https://studiosten.se/coachning';
	const STUDIO = 'https://studiosten.se';
	const L = '/bilder';

	const pal = $derived(valjPalett(page.url.searchParams.get('p')) ?? paletter['1']);
	const palStil = $derived(
		`--bas:${pal.bas};--papper:${pal.papper};--ink:${pal.ink};--mutad:${pal.mutad};--linje:${pal.linje};` +
			`--kort:${pal.kort};--kort-mork:${pal.kortMork};--korttext:${pal.korttext};--acc:${pal.acc};--acctext:${pal.acctext};` +
			`--sans:'${pal.brod}',system-ui,sans-serif`
	);

	/* ---------- Avsikt ---------- */

	type Val = 'forelasning' | 'team' | 'sjalv' | 'nyfiken';
	type Del = 'om' | 'keynotes' | 'team' | 'coachning' | 'kort';

	const fragan = 'Vad är du här för?';
	const val: { id: Val; etikett: string }[] = [
		{ id: 'forelasning', etikett: 'Boka en föreläsning' },
		{ id: 'team', etikett: 'Mitt team ska lära sig AI' },
		{ id: 'sjalv', etikett: 'Jag vill ha hjälp själv' },
		{ id: 'nyfiken', etikett: 'Jag är nyfiken på dig' }
	];

	const ordning: Record<Val | 'alla', Del[]> = {
		alla: ['om', 'keynotes', 'team', 'coachning', 'kort'],
		forelasning: ['keynotes', 'team', 'om', 'kort', 'coachning'],
		team: ['team', 'keynotes', 'coachning', 'om', 'kort'],
		sjalv: ['coachning', 'team', 'om', 'kort', 'keynotes'],
		nyfiken: ['om', 'kort', 'keynotes', 'team', 'coachning']
	};

	// Den rubrik som läses upp när sidan har ordnats om.
	const delNamn: Record<Del, string> = {
		om: utanNummer(t.start.om.etikett),
		keynotes: keynotes.titel,
		team: `${utbildning.titel}, ${radgivning.titel}`,
		coachning: utanNummer(t.start.coachning.etikett),
		kort: t.om.rubrik.join(' ')
	};

	const giltig = (v: string | null): Val | null => (val.some((x) => x.id === v) ? (v as Val) : null);

	let vald = $state<Val | null>(giltig(page.url.searchParams.get('for')));
	let hydrerad = $state(false);
	let meddelande = $state('');
	let reducerad = $state(false);
	const vtStod = $derived(hydrerad && typeof document !== 'undefined' && 'startViewTransition' in document);

	const delar = $derived(ordning[vald ?? 'alla']);
	const ledare = $derived(vald ? delar[0] : null);

	function hrefFor(id: Val | null) {
		const q = new URLSearchParams();
		if (id) q.set('for', id);
		const p = page.url.searchParams.get('p');
		if (p) q.set('p', p);
		const s = q.toString();
		return s ? `?${s}` : page.url.pathname;
	}

	async function valj(id: Val) {
		const nytt = vald === id ? null : id;
		const forsta = nytt ? ordning[nytt][0] : null;
		const el = forsta ? document.getElementById(forsta) : null;

		const uppdatera = async () => {
			vald = nytt;
			await tick();
		};

		if (vtStod && !reducerad) {
			// Bara den del som flyttas upp får ett eget namn. Allt annat tonar lugnt över.
			if (el) el.style.viewTransitionName = 'leder';
			const vt = document.startViewTransition(uppdatera);
			await vt.updateCallbackDone;
			vt.finished.finally(() => el && (el.style.viewTransitionName = ''));
		} else {
			await uppdatera();
		}

		// Ta besökaren till det hon valde: glid ner till delen och flytta fokus till rubriken.
		if (forsta) {
			const mal = document.getElementById(forsta);
			mal?.scrollIntoView({ behavior: reducerad ? 'auto' : 'smooth', block: 'start' });
			const rubrik = mal?.querySelector<HTMLElement>('h2');
			if (rubrik) {
				rubrik.tabIndex = -1;
				rubrik.focus({ preventScroll: true });
			}
		}

		replaceState(hrefFor(nytt), {});
		meddelande = forsta ? delNamn[forsta] : '';
	}

	/* ---------- Filmen ---------- */

	type Bild = { src: string; pos?: string };
	const bilder: Record<Del | 'hero' | 'kontakt', Bild> = {
		// Bara bilderna som Nicole godkänt för live-sajten (static/bilder/)
		hero: { src: `${L}/publik-1600.webp`, pos: '50% 4%' },
		om: { src: `${L}/profil-1600.webp`, pos: '48% 45%' },
		keynotes: { src: `${L}/scen-bw-2160.webp`, pos: '46% 30%' },
		team: { src: `${L}/publik-1600.webp`, pos: '50% 4%' },
		coachning: { src: `${L}/profil-1600.webp`, pos: '48% 45%' },
		kort: { src: `${L}/scen-bw-2160.webp`, pos: '46% 30%' },
		kontakt: { src: `${L}/publik-1600.webp`, pos: '50% 4%' }
	};
	// Alt-texter bara där i18n redan beskriver bilden. Övriga foton är stämning och får tom alt.
	const alt: Partial<Record<Del | 'kontakt', string>> = {
		keynotes: t.start.om.bildAlt,
		kort: t.om.bildAlt,
		kontakt: t.start.heroAlt
	};
	// Unika bilder: samma bild kan höra till flera delar
	const scenBilder = [...new Set(Object.values(bilder).map((b) => b.src))];

	let aktiv = $state<Del | 'hero' | 'kontakt'>('hero');
	// I toppen visar scenen fotot för det du valt, så att bilden svarar direkt på valet.
	const aktivBild = $derived(aktiv === 'hero' ? bilder[ledare ?? 'hero'].src : bilder[aktiv].src);

	let rot: HTMLElement;

	$effect(() => {
		const html = document.documentElement;
		const fore = { tema: html.dataset.tema, bg: html.style.background, body: document.body.style.background };
		delete html.dataset.tema;
		hydrerad = true;

		const mq = matchMedia('(prefers-reduced-motion: reduce)');
		reducerad = mq.matches;
		const andrat = () => (reducerad = mq.matches);
		mq.addEventListener('change', andrat);

		// Den del som korsar mitten av vyn bestämmer fotot.
		const io = new IntersectionObserver(
			(poster) => {
				for (const p of poster) if (p.isIntersecting) aktiv = (p.target as HTMLElement).dataset.bild as typeof aktiv;
			},
			{ rootMargin: '-50% 0px -50% 0px' }
		);
		rot.querySelectorAll('[data-bild]').forEach((s) => io.observe(s));

		return () => {
			io.disconnect();
			mq.removeEventListener('change', andrat);
			if (fore.tema) html.dataset.tema = fore.tema;
			html.style.background = fore.bg;
			document.body.style.background = fore.body;
		};
	});

	$effect(() => {
		document.documentElement.style.background = pal.bas;
		document.body.style.background = pal.bas;
	});
</script>

<svelte:head>
	<title>{t.start.titel}</title>
	<meta name="robots" content="noindex" />
	<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=sentient@300,400,500&display=swap" />
	{#each pal.fontshare as f (f)}
		<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]={f}&display=swap" />
	{/each}
	<link rel="preload" as="image" href={bilder.hero.src} />
</svelte:head>

{#snippet ny()}<span class="sr"> {t.nyFlik}</span>{/snippet}

{#snippet foto(id: Del | 'kontakt')}
	<img
		class="foto"
		src={bilder[id].src}
		alt={alt[id] ?? ''}
		loading="lazy"
		decoding="async"
		width="1800"
		height="1200"
		style:object-position={bilder[id].pos}
	/>
{/snippet}

<div class="sida" bind:this={rot} style={palStil}>
	<a class="hoppa" href="#innehall">{t.hoppa}</a>

	<!-- Scenen: fast foto på datorskärm. Döljs på mobil, där varje del har sitt foto ovanför texten. -->
	<div class="scen" aria-hidden="true">
		{#each scenBilder as src, i (src)}
			<img
				class="bild"
				class:pa={src === aktivBild}
				{src}
				alt=""
				loading={i === 0 ? 'eager' : 'lazy'}
				decoding="async"
				style:object-position={Object.values(bilder).find((b) => b.src === src)?.pos}
			/>
		{/each}
	</div>

	<div class="text">
		<header class="hero" data-bild="hero">
			<h1>{namn}</h1>
			<p class="ingress">{t.start.om.rubrik}</p>
			<p class="roller">{roller.join(' · ')}</p>
			<!-- På mobil står scenens första foto här, mellan presentationen och frågan. -->
			<img
				class="hero-foto"
				src={bilder.hero.src}
				alt=""
				decoding="async"
				width="1600"
				height="2000"
				style:object-position={bilder.hero.pos}
			/>

			<div class="avsikt" role="group" aria-labelledby="fragan">
				<p id="fragan" class="fragan">{fragan}</p>
				<ul>
					{#each val as v (v.id)}
						<li>
							{#if hydrerad}
								<button type="button" aria-pressed={vald === v.id} onclick={() => valj(v.id)}>
									{v.etikett}
								</button>
							{:else}
								<a href={hrefFor(v.id)} aria-current={vald === v.id ? 'true' : undefined}>{v.etikett}</a>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
			<p class="sr" aria-live="polite">{meddelande}</p>
		</header>

		<main id="innehall">
			{#each delar as d (d)}
				<section
					id={d}
					class="del"
					class:leder={d === ledare}
					data-bild={d}
					aria-labelledby="{d}-rubrik"
					animate:flip={{ duration: vtStod || reducerad ? 0 : 700 }}
				>
					{@render foto(d)}
					<div class="innehall">
						{#if d === 'om'}
							<h2 id="om-rubrik">{t.om.titel}</h2>
							{#each t.start.om.stycken as s (s)}<p>{s}</p>{/each}
							<p class="lankar">
								<a class:knapp={d === ledare} href={LINKEDIN} target="_blank" rel="noopener noreferrer">{t.kontakt.linkedin}{@render ny()}</a>
								<a href={SUBSTACK} target="_blank" rel="noopener noreferrer">Substack{@render ny()}</a>
							</p>
						{:else if d === 'keynotes'}
							<p class="lapp">{utanNummer(t.start.arbete.etikett)}</p>
							<h2 id="keynotes-rubrik">{keynotes.titel}</h2>
							<p>{keynotes.text}</p>
							<p class="lankar">
								<a class:knapp={d === ledare} href={LINKEDIN} target="_blank" rel="noopener noreferrer">{t.kontakt.linkedin}{@render ny()}</a>
								<a href={STUDIO} target="_blank" rel="noopener noreferrer">{t.start.arbete.boka}{@render ny()}</a>
							</p>
						{:else if d === 'team'}
							<p class="lapp">{utanNummer(t.start.arbete.etikett)}</p>
							<h2 id="team-rubrik">{utbildning.titel}</h2>
							<p>{utbildning.text}</p>
							<h2 class="andra">{radgivning.titel}</h2>
							<p>{radgivning.text}</p>
							<p class="lankar">
								<a class:knapp={d === ledare} href={STUDIO} target="_blank" rel="noopener noreferrer">{t.start.arbete.boka}{@render ny()}</a>
								<a href={LINKEDIN} target="_blank" rel="noopener noreferrer">{t.kontakt.linkedin}{@render ny()}</a>
							</p>
						{:else if d === 'coachning'}
							<p class="lapp">{utanNummer(t.start.coachning.etikett)}</p>
							<h2 id="coachning-rubrik">{t.start.coachning.rubrik}</h2>
							<p>{t.start.coachning.text}</p>
							<p class="meta">{t.start.coachning.kort}</p>
							<p class="lankar">
								<a class:knapp={d === ledare} href={COACHNING} target="_blank" rel="noopener noreferrer">{t.start.coachning.boka}{@render ny()}</a>
							</p>
						{:else}
							<p class="lapp">{t.om.etikett}</p>
							<h2 id="kort-rubrik">{t.om.rubrik.join(' ')}</h2>
							<dl class="pastaenden">
								{#each t.om.pastaenden as p (p.rubrik)}
									<div>
										<dt>{p.rubrik}</dt>
										<dd>{p.text}</dd>
									</div>
								{/each}
							</dl>
							{#if d === ledare}
								<p class="lankar">
									<a class="knapp" href={LINKEDIN} target="_blank" rel="noopener noreferrer">{t.kontakt.linkedin}{@render ny()}</a>
									<a href={SUBSTACK} target="_blank" rel="noopener noreferrer">Substack{@render ny()}</a>
								</p>
							{/if}
						{/if}
					</div>
				</section>
			{/each}

			<section id="kontakt" class="del kontakt" data-bild="kontakt" aria-labelledby="kontakt-rubrik">
				{@render foto('kontakt')}
				<div class="innehall">
					<p class="lapp">{t.kontakt.etikett}</p>
					<h2 id="kontakt-rubrik">{t.kontakt.rubrik.join(' ')}</h2>
					<p>{t.kontakt.text}</p>
					<p class="lankar">
						<a class="knapp" href={LINKEDIN} target="_blank" rel="noopener noreferrer">{t.kontakt.linkedin}{@render ny()}</a>
						<a href={STUDIO} target="_blank" rel="noopener noreferrer">Studio Stén{@render ny()}</a>
						<a href={SUBSTACK} target="_blank" rel="noopener noreferrer">Substack{@render ny()}</a>
					</p>
				</div>
			</section>
		</main>

		<footer>
			<p>{namn} · {t.kontakt.sverige}</p>
			<p>{t.kontakt.foto}</p>
		</footer>
	</div>
</div>

<style>
	.sida {
		--serif: 'Sentient', Georgia, 'Times New Roman', serif;
		--lugn: cubic-bezier(0.25, 0.1, 0.25, 1);
		background: var(--bas);
		color: var(--ink);
		font-family: var(--sans);
		font-size: 1.0625rem;
		line-height: 1.6;
		min-height: 100svh;
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	.hoppa {
		position: absolute;
		left: 1rem;
		top: -4rem;
		z-index: 10;
		padding: 0.6rem 1rem;
		background: var(--ink);
		color: var(--bas);
	}
	.hoppa:focus {
		top: 1rem;
	}

	/* ---------- Scenen ---------- */

	.scen {
		display: none;
	}

	.bild {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transform: scale(1);
		/* Skalan nollställs först när bilden har tonat ut, så ingenting syns hoppa. */
		transition:
			opacity 1.6s var(--lugn),
			transform 0s linear 1.6s;
	}
	.bild.pa {
		opacity: 1;
		transform: scale(1.04);
		transition:
			opacity 1.6s var(--lugn),
			transform 16s cubic-bezier(0.3, 0, 0.4, 1);
	}

	/* ---------- Text ---------- */

	.text {
		padding: 0 1.5rem;
	}

	.hero {
		padding: 3rem 0 2.5rem;
	}

	h1,
	h2,
	.fragan {
		font-family: var(--serif);
		font-weight: 400;
		letter-spacing: -0.01em;
	}

	h1 {
		font-size: clamp(3rem, 7vw, 5.6rem);
		line-height: 1.02;
		margin: 0;
	}

	.ingress {
		margin: 1.1rem 0 0;
		font-size: 1.25rem;
		line-height: 1.4;
		max-width: 26rem;
	}

	.roller {
		margin: 0.5rem 0 0;
		color: var(--mutad);
	}

	.hero-foto {
		display: block;
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
		margin-top: 2rem;
	}

	.avsikt {
		margin-top: 2.5rem;
	}

	.fragan {
		font-size: 1.45rem;
		margin: 0 0 1rem;
	}

	.avsikt ul {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--linje);
	}
	.avsikt li {
		border-bottom: 1px solid var(--linje);
	}

	.avsikt button,
	.avsikt a {
		display: block;
		width: 100%;
		padding: 0.95rem 0;
		background: none;
		border: 0;
		font: inherit;
		color: var(--ink);
		text-align: left;
		text-decoration: none;
		cursor: pointer;
		text-decoration-color: transparent;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.3em;
		transition: color 0.4s var(--lugn), text-decoration-color 0.4s var(--lugn);
	}
	.avsikt button:hover,
	.avsikt a:hover {
		text-decoration: underline;
		text-decoration-color: var(--linje);
	}
	/* När något är valt kliver de andra valen tillbaka till mutad (fortfarande AA). */
	.avsikt ul:has([aria-pressed='true']) button:not([aria-pressed='true']) {
		color: var(--mutad);
	}
	.avsikt [aria-pressed='true'],
	.avsikt [aria-current='true'] {
		font-weight: 600;
		text-decoration: underline;
		text-decoration-color: currentColor;
		text-decoration-thickness: 1.5px;
		text-underline-offset: 0.3em;
	}
	/* Liten markör framför valt alternativ */
	.avsikt [aria-pressed='true']::before,
	.avsikt [aria-current='true']::before {
		content: '→ ';
		text-decoration: none;
		display: inline-block;
		margin-right: 0.35em;
	}

	h2:focus {
		outline: none;
	}

	button:focus-visible,
	a:focus-visible {
		border-radius: 6px;
		outline: 2px solid var(--ink);
		outline-offset: 3px;
	}

	.del {
		padding: 0 0 3.5rem;
		scroll-margin-top: 1.5rem;
	}

	.foto {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 4.2;
		object-fit: cover;
		margin-bottom: 1.75rem;
	}

	.lapp {
		margin: 0 0 0.75rem;
		font-size: 0.875rem;
		color: var(--mutad);
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}
	/* Den oväntade färgen, sparsamt: ett kort streck före varje etikett (dekor, ingen text) */
	.lapp::before {
		content: '';
		width: 1.6rem;
		height: 3px;
		border-radius: 2px;
		background: var(--acc);
	}

	h2 {
		font-size: clamp(2.2rem, 3.9vw, 3.3rem);
		color: var(--kort);
		line-height: 1.1;
		margin: 0 0 1.25rem;
		text-wrap: balance;
	}
	h2.andra {
		margin-top: 2.5rem;
	}

	.innehall > p {
		margin: 0 0 1rem;
		max-width: 34rem;
	}

	.meta {
		color: var(--mutad);
		font-size: 0.95rem;
	}

	.pastaenden {
		margin: 0;
		max-width: 34rem;
	}
	.pastaenden div {
		padding: 1.1rem 0;
		border-top: 1px solid var(--linje);
	}
	.pastaenden dt {
		font-weight: 500;
	}
	.pastaenden dd {
		margin: 0.25rem 0 0;
		color: var(--mutad);
	}

	.lankar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem 1.75rem;
		margin-top: 2rem !important;
	}
	.lankar a {
		color: var(--ink);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.25em;
	}
	.lankar a.knapp {
		padding: 0.8rem 1.4rem;
		border-radius: 999px;
		background: var(--kort);
		color: var(--korttext);
		text-decoration: none;
		transition: background 0.3s var(--lugn);
	}
	.lankar a.knapp:hover {
		background: var(--kort-mork);
	}

	footer {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.5rem 2rem;
		padding: 2rem 0 3rem;
		border-top: 1px solid var(--linje);
		font-size: 0.875rem;
		color: var(--mutad);
	}
	footer p {
		margin: 0;
	}

	/* ---------- Surfplatta: lägre bilder så att valen syns tidigt ---------- */
	@media (min-width: 600px) and (max-width: 899px) {
		.hero-foto,
		.foto {
			aspect-ratio: 16 / 10;
			max-height: 62svh;
		}
	}

	/* ---------- Dator: foto till vänster, text till höger ---------- */

	@media (min-width: 900px) {
		.sida {
			display: grid;
			/* Smalare bildspalt (ca 40 %) så att bilden inte tar över */
			grid-template-columns: minmax(20rem, 40vw) minmax(0, 1fr);
		}

		.scen {
			display: block;
			position: sticky;
			top: 0;
			height: 100svh;
			overflow: hidden;
			background: var(--papper);
			/* Scenen tonar själv mellan foton. View Transition ska inte tona den en gång till. */
			view-transition-name: scen;
		}

		.text {
			padding: 0 clamp(2.5rem, 6vw, 7rem);
			max-width: 46rem;
		}

		/* Kort nog att den första delen syns i underkant, så att omordningen märks. */
		.hero {
			padding: 10svh 0 2.5rem;
		}
		.hero-foto {
			display: none;
		}
		.avsikt {
			margin-top: 3.25rem;
		}

		.foto {
			display: none;
		}

		.del {
			/* Varje del är en bildruta: texten står mitt i, fotot hinner synas en stund. */
			min-height: 48svh;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 2.25rem 0;
			box-sizing: border-box;
		}
		/* Den första delen börjar direkt under frågan, så att omordningen syns. */
		.del:first-child {
			min-height: 0;
			padding: 1rem 0 3.5rem;
		}
	}

	/* ---------- Omordningen ---------- */

	:global(::view-transition-old(scen)) {
		display: none;
	}
	:global(::view-transition-new(scen)) {
		animation: none;
	}
	:global(::view-transition-group(leder)) {
		animation-duration: 0.9s;
		animation-timing-function: cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	:global(::view-transition-old(root)) {
		animation: 0.35s var(--lugn, ease) both vt-ut;
	}
	:global(::view-transition-new(root)) {
		animation: 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) 0.1s both vt-in;
	}
	@keyframes -global-vt-ut {
		to {
			opacity: 0;
		}
	}
	@keyframes -global-vt-in {
		from {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.bild,
		.bild.pa {
			transition: none;
			transform: none;
		}
		.avsikt button,
		.avsikt a {
			transition: none;
		}
	}
</style>
