<script lang="ts">
	import type { Piece } from './types';
	import { MAL, nastaSteg } from './types';
	import { hub, lagg, andra } from './store.svelte';
	import { iso, fran, mandag, plusDagar, kort, dagnamn, iVeckan, tidpunkt } from './datum';

	let { oppna, tillIdeer }: { oppna: (p: Piece) => void; tillIdeer: () => void } = $props();

	const DAGAR = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'];
	const MANADER = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
	const nu = new Date();
	const vecka = mandag(nu);
	const datumrad = `${DAGAR[nu.getDay()]} ${nu.getDate()} ${MANADER[nu.getMonth()]}`;

	// Nästa sak som ska ut
	const nasta = $derived(
		hub.hub_pieces
			.filter((p) => p.status !== 'ute' && p.planerad && new Date(p.planerad).getTime() > Date.now() - 3600_000)
			.sort((a, b) => a.planerad!.localeCompare(b.planerad!))[0]
	);
	const steg = $derived(nasta ? nastaSteg(nasta) : undefined);

	const filmer = $derived(hub.hub_pieces.filter((p) => p.typ === 'film'));
	const ute = $derived(filmer.filter((p) => p.status === 'ute').length);
	const paVag = $derived(filmer.filter((p) => p.status !== 'ute' && p.planerad).length);
	const dagarKvar = Math.max(0, Math.ceil((fran(MAL.datum).getTime() - Date.now()) / 86400000));

	// Veckans att göra: bara de tre närmaste som inte är klara syns
	const todos = $derived(hub.hub_todos.filter((t) => t.vecka === iso(vecka)).sort((a, b) => a.sort - b.sort));
	const kvar = $derived(todos.filter((t) => !t.klar));
	const klara = $derived(todos.length - kvar.length);
	let visaAlla = $state(false);
	const synliga = $derived(visaAlla ? kvar : kvar.slice(0, 3));

	const veckan = $derived(
		hub.hub_events.filter((e) => iVeckan(vecka, e.datum, e.slut) && e.typ !== 'kontroll').sort((a, b) => a.datum.localeCompare(b.datum))
	);
	const ledig = $derived(veckan.some((e) => e.typ === 'ledigt'));
	const nastaVecka = $derived(
		hub.hub_events
			.filter((e) => iVeckan(plusDagar(vecka, 7), e.datum, e.slut) && e.typ !== 'kontroll')
			.sort((a, b) => a.datum.localeCompare(b.datum))
			.map((e) => (e.typ === 'filmblock' ? `filmblock ${dagnamn(fran(e.datum))}` : e.titel.split(',')[0]))
			.join(', ')
	);

	let ny = $state('');
	async function laggTill(e: SubmitEvent) {
		e.preventDefault();
		if (!ny.trim()) return;
		await lagg('hub_todos', { vecka: iso(vecka), dag: '', text: ny.trim(), klar: false, sort: todos.length });
		ny = '';
	}

	const dagText = (e: { datum: string; slut: string | null }) =>
		e.slut && e.slut !== e.datum ? `${dagnamn(fran(e.datum))}–${dagnamn(fran(e.slut))}` : `${dagnamn(fran(e.datum))} ${fran(e.datum).getDate()}`;
</script>

<header class="halsning">
	<p class="datum">{datumrad}</p>
	<h1 class="rubrik">Hej Nicole.</h1>
</header>

<section class="hero" aria-labelledby="nasta">
	<div class="hero-inner">
		{#if nasta}
			<p class="eyebrow">Nästa ut · {tidpunkt(nasta.planerad)}</p>
			<h2 id="nasta" class="rubrik"><button type="button" onclick={() => oppna(nasta)}>{nasta.titel}</button></h2>
			{#if steg}
				<button
					type="button"
					class="hero-knapp"
					onclick={() => andra('hub_pieces', nasta.id, { status: steg.id, ...(steg.id === 'ute' ? { postad: new Date().toISOString() } : {}) })}
					>Markera som {steg.namn.toLowerCase()}</button
				>
			{/if}
		{:else}
			<p class="eyebrow">Nästa ut</p>
			<h2 id="nasta" class="rubrik">Din nästa film börjar som en tanke.</h2>
			<button type="button" class="hero-knapp" onclick={tillIdeer}>Fånga en tanke</button>
		{/if}
	</div>
</section>

<p class="mal">
	<b>{ute} ute</b> · {paVag} på väg · {dagarKvar} dagar till {kort(fran(MAL.datum))}
</p>

<section class="block" aria-labelledby="gora">
	<h2 id="gora" class="rubrik liten">Den här veckan</h2>

	{#if veckan.length}
		<ul class="handelser">
			{#each veckan as e (e.id)}
				<li class:film={e.typ === 'filmblock'}><span class="dag">{dagText(e)}</span>{e.typ === 'filmblock' ? `Filmblock${e.anteckning ? ` · ${e.anteckning}` : ''}` : e.titel}</li>
			{/each}
		</ul>
	{/if}
	{#if ledig}<p class="mjuk">Ledigt. Vila räknas också.</p>{/if}

	<ul class="todo">
		{#each synliga as t (t.id)}
			<li>
				<label>
					<input type="checkbox" checked={t.klar} onchange={(e) => andra('hub_todos', t.id, { klar: e.currentTarget.checked })} />
					<span>{t.text}{#if t.dag}<small> · {t.dag.toLowerCase()}</small>{/if}</span>
				</label>
			</li>
		{/each}
	</ul>
	{#if kvar.length > 3}
		<button type="button" class="lank" onclick={() => (visaAlla = !visaAlla)}>{visaAlla ? 'Visa färre' : `Visa alla ${kvar.length}`}</button>
	{/if}
	{#if todos.length && !kvar.length}
		<p class="klart rubrik">Klart för veckan.</p>
	{:else if klara}
		<p class="mjuk">{klara} klara.</p>
	{/if}
	<form onsubmit={laggTill}>
		<input bind:value={ny} placeholder="+ Lägg till" aria-label="Lägg till något att göra" />
	</form>
</section>

{#if nastaVecka}
	<p class="framat"><span>Nästa vecka</span> {nastaVecka}</p>
{/if}

<style>
	.halsning {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.datum {
		margin: 0;
		color: var(--color-grafit);
		font-size: 16px;
	}
	.datum::first-letter {
		text-transform: uppercase;
	}
	.halsning h1 {
		font-size: clamp(40px, 7vw, 64px);
	}

	/* Scenbilden, alltid mörk */
	.hero {
		color: #f6f3ea;
		background:
			linear-gradient(90deg, rgb(10 10 10 / 0.9) 0%, rgb(10 10 10 / 0.65) 50%, rgb(10 10 10 / 0.1) 100%),
			linear-gradient(0deg, rgb(10 10 10 / 0.8) 0%, transparent 60%),
			url('/bilder/scen-bw-1200.webp') 72% 28% / cover no-repeat #0b0b0b;
		min-height: min(56vh, 460px);
		display: flex;
		align-items: flex-end;
	}
	.hero-inner {
		padding: 32px clamp(20px, 4vw, 40px);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
	}
	.eyebrow {
		margin: 0;
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--smor);
	}
	.hero h2 {
		font-size: clamp(40px, 7.5vw, 88px);
		line-height: 1;
		max-width: 13ch;
	}
	.hero h2 button {
		all: unset;
		cursor: pointer;
	}
	.hero h2 button:focus-visible {
		outline: 2px solid var(--smor);
		outline-offset: 4px;
	}
	.hero-knapp {
		background: var(--smor);
		color: #17150f;
		border: 0;
		padding: 12px 20px;
		min-height: 48px;
		font-weight: 700;
		font-size: 16px;
		cursor: pointer;
	}
	.hero-knapp:hover {
		background: #fff;
	}

	.mal {
		margin: -12px 0 0;
		font-size: 17px;
		color: var(--color-grafit);
	}
	.mal b {
		color: var(--color-svart);
	}

	.block {
		display: flex;
		flex-direction: column;
		gap: 14px;
		max-width: 640px;
	}
	.liten {
		font-size: 32px;
	}
	.handelser {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 17px;
		color: var(--color-grafit);
	}
	.handelser li {
		display: grid;
		grid-template-columns: 5.2em minmax(0, 1fr);
		gap: 10px;
	}
	.handelser li.film {
		color: var(--color-svart);
		font-weight: 700;
	}
	.dag {
		font-size: 14px;
		font-weight: 700;
		padding-top: 2px;
	}
	.dag::first-letter {
		text-transform: uppercase;
	}
	.todo {
		list-style: none;
		margin: 8px 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.todo label {
		display: grid;
		grid-template-columns: 34px minmax(0, 1fr);
		gap: 8px;
		padding: 10px 0;
		cursor: pointer;
		font-size: 19px;
		line-height: 1.35;
	}
	.todo input {
		width: 26px;
		height: 26px;
		margin: 0;
		accent-color: #c9a227;
		cursor: pointer;
	}
	.todo small {
		color: var(--color-grafit);
		font-size: 15px;
	}
	.lank {
		align-self: flex-start;
		background: none;
		border: 0;
		padding: 4px 0;
		color: var(--color-grafit);
		text-decoration: underline;
		cursor: pointer;
		font-size: 15px;
	}
	.mjuk {
		margin: 0;
		color: var(--color-grafit);
		font-size: 15px;
	}
	.klart {
		margin: 0;
		font-size: 30px;
		background: var(--smor);
		color: #17150f;
		padding: 6px 14px;
		align-self: flex-start;
	}
	form input {
		width: 100%;
		background: none;
		border: 0;
		padding: 10px 0;
		font-size: 17px;
		color: var(--color-svart);
	}
	form input::placeholder {
		color: var(--color-grafit);
	}
	form input:focus-visible {
		outline: none;
		box-shadow: inset 0 -1px 0 var(--color-svart);
	}
	.framat {
		margin: 0;
		color: var(--color-grafit);
		font-size: 15px;
		max-width: 640px;
	}
	.framat span {
		font-weight: 700;
		color: var(--color-svart);
		margin-right: 6px;
	}
</style>
