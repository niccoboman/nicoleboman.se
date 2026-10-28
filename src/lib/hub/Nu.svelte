<script lang="ts">
	import type { Piece } from './types';
	import { PELARE, FORMAT, MAL, namnFor, nastaSteg } from './types';
	import { hub, lagg, andra, tabort } from './store.svelte';
	import { iso, fran, mandag, plusDagar, veckonummer, spann, kort, dagnamn, iVeckan, tidpunkt } from './datum';

	let { oppna, tillIdeer }: { oppna: (p: Piece) => void; tillIdeer: () => void } = $props();

	const idag = mandag(new Date());
	let vald = $state(mandag(new Date()));
	const arIdag = $derived(iso(vald) === iso(idag));

	// Nästa sak som ska ut, oavsett om den är filmad än
	const nasta = $derived(
		hub.hub_pieces
			.filter((p) => p.status !== 'ute' && p.planerad && new Date(p.planerad).getTime() > Date.now() - 3600_000)
			.sort((a, b) => a.planerad!.localeCompare(b.planerad!))[0]
	);
	const nastaSteget = $derived(nasta ? nastaSteg(nasta) : undefined);

	// Mot målet: fyllda rutor är ute, kantade har en tid
	const filmer = $derived(hub.hub_pieces.filter((p) => p.typ === 'film'));
	const ute = $derived(filmer.filter((p) => p.status === 'ute').length);
	const planerade = $derived(filmer.filter((p) => p.status !== 'ute' && p.planerad).length);
	const dagarKvar = Math.max(0, Math.ceil((fran(MAL.datum).getTime() - Date.now()) / 86400000));

	const handelser = $derived(
		hub.hub_events.filter((e) => iVeckan(vald, e.datum, e.slut)).sort((a, b) => a.datum.localeCompare(b.datum))
	);
	const todos = $derived(hub.hub_todos.filter((t) => t.vecka === iso(vald)).sort((a, b) => a.sort - b.sort));
	const klara = $derived(todos.filter((t) => t.klar).length);
	const allaKlara = $derived(todos.length > 0 && klara === todos.length);

	const kommande = $derived([1, 2, 3].map((n) => plusDagar(idag, n * 7)));
	const sammanfatta = (m: Date) =>
		hub.hub_events
			.filter((e) => iVeckan(m, e.datum, e.slut) && e.typ !== 'kontroll')
			.sort((a, b) => a.datum.localeCompare(b.datum))
			.map((e) => (e.typ === 'filmblock' ? `Filmblock ${dagnamn(fran(e.datum))}` : e.titel.split(',')[0]))
			.join(' · ');

	let ny = $state('');
	async function laggTill(e: SubmitEvent) {
		e.preventDefault();
		if (!ny.trim()) return;
		// "Mån: text" blir dag + text
		const m = ny.match(/^(\p{L}{3}(?:[–-]\p{L}{3})?):\s*(.+)$/u);
		await lagg('hub_todos', { vecka: iso(vald), dag: m ? m[1] : '', text: (m ? m[2] : ny).trim(), klar: false, sort: todos.length });
		ny = '';
	}

	function dagText(e: { datum: string; slut: string | null }) {
		const a = fran(e.datum);
		if (!e.slut || e.slut === e.datum) return `${dagnamn(a)} ${a.getDate()}`;
		return `${dagnamn(a)}–${dagnamn(fran(e.slut))}`;
	}
</script>

<section class="hero" aria-labelledby="nasta-rubrik">
	<div class="hero-inner">
		{#if nasta}
			<p class="eyebrow">Nästa ut · {tidpunkt(nasta.planerad)}</p>
			<h1 id="nasta-rubrik" class="rubrik">
				<button type="button" onclick={() => oppna(nasta)}>{nasta.titel}</button>
			</h1>
			<div class="hero-rad">
				<span class="hero-meta">
					{nasta.typ === 'inlagg' ? 'LinkedIn' : [namnFor(PELARE, nasta.pelare), namnFor(FORMAT, nasta.format)].filter(Boolean).join(' · ')}
				</span>
				{#if nastaSteget}
					<button
						type="button"
						class="hero-knapp"
						onclick={() => andra('hub_pieces', nasta.id, { status: nastaSteget.id, ...(nastaSteget.id === 'ute' ? { postad: new Date().toISOString() } : {}) })}
						>{nastaSteget.namn} <span aria-hidden="true">→</span></button
					>
				{/if}
			</div>
		{:else}
			<p class="eyebrow">Nästa ut</p>
			<h1 id="nasta-rubrik" class="rubrik">Din nästa film börjar som en tanke.</h1>
			<div class="hero-rad"><button type="button" class="hero-knapp" onclick={tillIdeer}>Fånga en tanke <span aria-hidden="true">→</span></button></div>
		{/if}
	</div>
</section>

<section class="mal" aria-label="Mot målet">
	<div class="mal-siffra">
		<span class="rubrik stor">{ute}</span>
		<span class="mal-text"><b>av {MAL.filmer} filmer ute</b><br />{planerade} har redan en tid · {dagarKvar} dagar kvar</span>
	</div>
	<div class="rutor" aria-hidden="true">
		{#each Array(MAL.filmer) as _, i (i)}
			<span class:fylld={i < ute} class:planerad={i >= ute && i < ute + planerade}></span>
		{/each}
	</div>
</section>

<section class="vecka" aria-labelledby="vecka-rubrik">
	<div class="vecka-topp">
		<h2 id="vecka-rubrik" class="rubrik">{arIdag ? 'Den här veckan' : `Vecka ${veckonummer(vald)}`} <span class="dampad">{spann(vald)}</span></h2>
		<div class="pilar">
			<button type="button" aria-label="Förra veckan" onclick={() => (vald = plusDagar(vald, -7))}>←</button>
			{#if !arIdag}<button type="button" onclick={() => (vald = idag)}>Idag</button>{/if}
			<button type="button" aria-label="Nästa vecka" onclick={() => (vald = plusDagar(vald, 7))}>→</button>
		</div>
	</div>

	{#if handelser.length}
		<ul class="handelser">
			{#each handelser as e (e.id)}
				<li class:block={e.typ === 'filmblock'}><span class="dag">{dagText(e)}</span><span>{e.titel}{e.anteckning ? ` · ${e.anteckning}` : ''}</span></li>
			{/each}
		</ul>
	{/if}

	{#if allaKlara}
		<p class="klart rubrik">Klart för veckan.</p>
	{/if}
	<ul class="todo">
		{#each todos as t (t.id)}
			<li>
				<label>
					<input type="checkbox" checked={t.klar} onchange={(e) => andra('hub_todos', t.id, { klar: e.currentTarget.checked })} />
					<span class:klar={t.klar}>{#if t.dag}<b>{t.dag}</b> {/if}{t.text}</span>
				</label>
				<button type="button" class="x" aria-label="Ta bort {t.text}" onclick={() => tabort('hub_todos', t.id)}>×</button>
			</li>
		{/each}
	</ul>
	<form onsubmit={laggTill}>
		<input bind:value={ny} placeholder="Lägg till, t.ex. Tor: filma i bilen" aria-label="Ny sak att göra" />
	</form>
</section>

<section class="framat" aria-labelledby="framat-rubrik">
	<h2 id="framat-rubrik" class="etikett">Kommande veckor</h2>
	{#each kommande as m (iso(m))}
		<button type="button" class="framat-rad" onclick={() => { vald = m; document.getElementById('vecka-rubrik')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
			<span class="v">v {veckonummer(m)}</span>
			<span>{sammanfatta(m) || 'Inget inbokat'}</span>
		</button>
	{/each}
</section>

<style>
	/* Hjälten: scenbilden, alltid mörk, med nästa film i jättestil */
	.hero {
		position: relative;
		min-height: min(62vh, 520px);
		display: flex;
		align-items: flex-end;
		color: #f6f3ea;
		background:
			linear-gradient(90deg, rgb(10 10 10 / 0.92) 0%, rgb(10 10 10 / 0.7) 45%, rgb(10 10 10 / 0.15) 100%),
			linear-gradient(0deg, rgb(10 10 10 / 0.85) 0%, transparent 55%),
			url('/bilder/scen-bw-1200.webp') 70% 30% / cover no-repeat #0b0b0b;
		margin: -24px calc(-1 * max(16px, env(safe-area-inset-left))) 0;
	}
	.hero-inner {
		padding: 40px max(16px, env(safe-area-inset-left)) 32px;
		max-width: 1100px;
		width: 100%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.eyebrow {
		margin: 0;
		font-size: 14px;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--smor);
	}
	.hero h1 {
		font-size: clamp(44px, 8.5vw, 104px);
		max-width: 14ch;
		line-height: 0.98;
	}
	.hero h1 button {
		all: unset;
		cursor: pointer;
	}
	.hero h1 button:focus-visible {
		outline: 2px solid var(--smor);
		outline-offset: 4px;
	}
	.hero-rad {
		display: flex;
		align-items: center;
		gap: 18px;
		flex-wrap: wrap;
	}
	.hero-meta {
		font-size: 16px;
		opacity: 0.8;
	}
	.hero-knapp {
		background: var(--smor);
		color: #17150f;
		border: 0;
		padding: 12px 20px;
		min-height: 48px;
		font-weight: 800;
		font-size: 16px;
		cursor: pointer;
	}
	.hero-knapp:hover {
		background: #fff;
	}

	/* Målet */
	.mal {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.mal-siffra {
		display: flex;
		align-items: flex-end;
		gap: 16px;
	}
	.stor {
		font-size: clamp(72px, 12vw, 120px);
		line-height: 0.85;
	}
	.mal-text {
		font-size: 16px;
		color: var(--color-grafit);
		padding-bottom: 4px;
	}
	.mal-text b {
		color: var(--color-svart);
		font-size: 18px;
	}
	.rutor {
		display: grid;
		grid-template-columns: repeat(33, minmax(0, 1fr));
		gap: 4px;
	}
	.rutor span {
		aspect-ratio: 1;
		border: 1px solid var(--color-linje);
	}
	.rutor span.planerad {
		border: 2px solid var(--smor-linje);
	}
	.rutor span.fylld {
		background: var(--smor);
		border-color: var(--smor);
	}
	@media (max-width: 640px) {
		.rutor {
			grid-template-columns: repeat(11, minmax(0, 1fr));
		}
	}

	/* Veckan */
	.vecka {
		display: flex;
		flex-direction: column;
		gap: 14px;
		scroll-margin-top: 80px;
	}
	.vecka-topp {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		border-bottom: 2px solid var(--color-svart);
		padding-bottom: 8px;
	}
	.vecka h2 {
		font-size: clamp(30px, 5vw, 44px);
	}
	.vecka h2 .dampad {
		font-family: var(--font-arkiv);
		font-size: 16px;
		text-transform: none;
		margin-left: 6px;
	}
	.pilar {
		display: flex;
		gap: 6px;
	}
	.pilar button {
		background: none;
		border: 1px solid var(--color-svart);
		min-width: 44px;
		min-height: 40px;
		padding: 0 10px;
		cursor: pointer;
		font-weight: 700;
	}
	.handelser {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
		font-size: 16px;
		color: var(--color-grafit);
	}
	.handelser li {
		display: grid;
		grid-template-columns: 5.5em minmax(0, 1fr);
		gap: 10px;
	}
	.handelser li.block {
		color: var(--color-svart);
		font-weight: 700;
	}
	.handelser li.block .dag {
		background: var(--smor);
		color: #17150f;
		padding: 0 4px;
		justify-self: start;
	}
	.dag {
		text-transform: uppercase;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.04em;
		padding-top: 2px;
	}
	.klart {
		margin: 0;
		font-size: 32px;
		background: var(--smor);
		color: #17150f;
		padding: 8px 14px;
		align-self: flex-start;
	}
	.todo {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.todo li {
		display: flex;
		align-items: flex-start;
		border-bottom: 1px solid var(--color-linje);
	}
	.todo label {
		flex: 1;
		display: grid;
		grid-template-columns: 32px minmax(0, 1fr);
		gap: 8px;
		padding: 12px 0;
		cursor: pointer;
		font-size: 18px;
	}
	.todo input {
		width: 24px;
		height: 24px;
		margin: 2px 0 0;
		accent-color: #c9a227;
		cursor: pointer;
	}
	.todo b {
		text-transform: uppercase;
		font-size: 13px;
		letter-spacing: 0.05em;
		margin-right: 4px;
	}
	.klar {
		text-decoration: line-through;
		opacity: 0.4;
	}
	.x {
		background: none;
		border: 0;
		opacity: 0.3;
		font-size: 20px;
		min-width: 40px;
		min-height: 44px;
		cursor: pointer;
	}
	.x:hover {
		opacity: 1;
	}
	form input {
		width: 100%;
		background: none;
		border: 0;
		border-bottom: 1px dashed var(--color-linje);
		padding: 12px 0;
		font-size: 17px;
	}
	form input:focus-visible {
		outline: none;
		border-bottom: 1px solid var(--color-svart);
	}

	/* Framåt */
	.framat {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.framat h2 {
		margin-bottom: 6px;
	}
	.framat-rad {
		all: unset;
		box-sizing: border-box;
		display: grid;
		grid-template-columns: 3.5em minmax(0, 1fr);
		gap: 10px;
		padding: 10px 0;
		border-bottom: 1px solid var(--color-linje);
		cursor: pointer;
		font-size: 15px;
		color: var(--color-grafit);
	}
	.framat-rad:hover {
		color: var(--color-svart);
	}
	.framat-rad:focus-visible {
		outline: 2px solid var(--color-oxblod);
	}
	.v {
		font-weight: 800;
		color: var(--color-svart);
	}
</style>
