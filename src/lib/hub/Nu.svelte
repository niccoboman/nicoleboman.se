<script lang="ts">
	import type { Piece } from './types';
	import { hub, lagg, andra, tabort } from './store.svelte';
	import { iso, fran, mandag, plusDagar, veckonummer, spann, kort, dagnamn, iVeckan } from './datum';
	import PieceCard from './PieceCard.svelte';

	let { oppna }: { oppna: (p: Piece) => void } = $props();

	const idag = mandag(new Date());
	let vald = $state(mandag(new Date()));
	const arIdag = $derived(iso(vald) === iso(idag));

	const handelser = $derived(
		hub.hub_events.filter((e) => iVeckan(vald, e.datum, e.slut)).sort((a, b) => a.datum.localeCompare(b.datum))
	);
	const todos = $derived(hub.hub_todos.filter((t) => t.vecka === iso(vald)).sort((a, b) => a.sort - b.sort));
	const ut = $derived(
		hub.hub_pieces
			.filter((p) => p.planerad && iVeckan(vald, iso(new Date(p.planerad))))
			.sort((a, b) => (a.planerad ?? '').localeCompare(b.planerad ?? ''))
	);
	const klara = $derived(todos.filter((t) => t.klar).length);

	// Alla veckor från de tidigaste till de senaste inbokade dagarna
	const veckor = $derived.by(() => {
		const datum = [...hub.hub_events.map((e) => e.slut ?? e.datum), ...hub.hub_todos.map((t) => t.vecka), iso(idag)].sort();
		if (!datum.length) return [];
		const lista: Date[] = [];
		for (let m = mandag(fran(datum[0])); iso(m) <= datum[datum.length - 1]; m = plusDagar(m, 7)) lista.push(m);
		return lista.filter((m) => iso(m) >= iso(plusDagar(idag, -7)));
	});

	function handelserFor(m: Date) {
		return hub.hub_events.filter((e) => iVeckan(m, e.datum, e.slut) && e.typ !== 'filmblock').sort((a, b) => a.datum.localeCompare(b.datum));
	}
	function filmblockFor(m: Date) {
		return hub.hub_events.find((e) => iVeckan(m, e.datum) && e.typ === 'filmblock');
	}

	let ny = $state('');
	let nyDag = $state('');
	async function laggTill(e: SubmitEvent) {
		e.preventDefault();
		if (!ny.trim()) return;
		await lagg('hub_todos', { vecka: iso(vald), dag: nyDag.trim(), text: ny.trim(), klar: false, sort: todos.length });
		ny = '';
		nyDag = '';
	}

	function dagText(e: { datum: string; slut: string | null }) {
		const a = fran(e.datum);
		if (!e.slut || e.slut === e.datum) return `${dagnamn(a)} ${kort(a)}`;
		const b = fran(e.slut);
		return `${dagnamn(a)}–${dagnamn(b)} ${kort(a)}–${kort(b)}`;
	}
</script>

<section class="nu" aria-labelledby="nu-rubrik">
	<div class="topp">
		<span class="lbl">{arIdag ? 'Den här veckan' : iso(vald) === iso(plusDagar(idag, 7)) ? 'Nästa vecka' : iso(vald) < iso(idag) ? 'Tidigare' : 'Längre fram'}</span>
		<div class="pilar">
			<button type="button" aria-label="Förra veckan" onclick={() => (vald = plusDagar(vald, -7))}>←</button>
			{#if !arIdag}<button type="button" onclick={() => (vald = idag)}>Idag</button>{/if}
			<button type="button" aria-label="Nästa vecka" onclick={() => (vald = plusDagar(vald, 7))}>→</button>
		</div>
	</div>
	<h2 id="nu-rubrik" class="rubrik">Vecka {veckonummer(vald)} · {spann(vald)}</h2>

	{#if handelser.length}
		<ul class="handelser">
			{#each handelser as e (e.id)}
				<li class:block={e.typ === 'filmblock'}>
					<span class="dag">{dagText(e)}</span>
					<span>{e.titel}{e.anteckning ? ` · ${e.anteckning}` : ''}</span>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="svag">Inget inbokat.</p>
	{/if}

	<div class="todo">
		<p class="lbl">Att göra {todos.length ? `· ${klara} av ${todos.length}` : ''}</p>
		<ul>
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
			<input class="dagfalt" bind:value={nyDag} placeholder="Dag" aria-label="Dag" />
			<input class="textfalt" bind:value={ny} placeholder="Lägg till…" aria-label="Ny sak att göra" />
			<button type="submit">Lägg till</button>
		</form>
	</div>
</section>

<section aria-labelledby="ut-rubrik" class="ut">
	<h3 id="ut-rubrik" class="etikett">Går ut den här veckan</h3>
	{#if ut.length}
		<div class="kort">
			{#each ut as p (p.id)}<PieceCard piece={p} {oppna} />{/each}
		</div>
	{:else}
		<p class="tom">Inget planerat. Golvet är en film i veckan.</p>
	{/if}
</section>

<section aria-labelledby="veckor-rubrik" class="veckor">
	<h3 id="veckor-rubrik" class="etikett">Alla veckor</h3>
	<div>
		{#each veckor as m (iso(m))}
			{@const fb = filmblockFor(m)}
			<button
				type="button"
				class="vecka"
				class:nu={iso(m) === iso(idag)}
				class:vald={iso(m) === iso(vald)}
				onclick={() => {
					vald = m;
					window.scrollTo({ top: 0, behavior: 'smooth' });
				}}
			>
				<span class="n">v {veckonummer(m)}<small>{spann(m)}</small></span>
				<span class="chips">
					{#each handelserFor(m) as e (e.id)}<span class="chip">{dagnamn(fran(e.datum))} {e.titel}</span>{/each}
					{#if fb}<span class="chip smor">Filmblock {dagnamn(fran(fb.datum))}</span>{/if}
				</span>
			</button>
		{/each}
	</div>
</section>

<style>
	/* Fast mörk ruta i båda lägena, så att det gula alltid syns */
	.nu {
		background: #17150f;
		color: #f6f3ea;
		border: 1px solid var(--color-linje);
		padding: 22px 20px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.topp {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lbl {
		margin: 0;
		font-size: 13px;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--smor);
	}
	.pilar {
		display: flex;
		gap: 6px;
	}
	.pilar button,
	form button {
		background: transparent;
		border: 1px solid currentColor;
		color: inherit;
		padding: 6px 12px;
		min-width: 44px;
		min-height: 40px;
		cursor: pointer;
		font-weight: 700;
	}
	h2 {
		font-size: clamp(30px, 6vw, 44px);
	}
	.handelser {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: 16px;
	}
	.handelser li {
		display: grid;
		grid-template-columns: 9.5em minmax(0, 1fr);
		gap: 10px;
		opacity: 0.85;
	}
	.handelser li.block {
		opacity: 1;
		color: var(--smor);
		font-weight: 700;
	}
	.dag {
		text-transform: uppercase;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.04em;
		padding-top: 2px;
	}
	.svag {
		opacity: 0.7;
		margin: 0;
	}
	.todo ul {
		list-style: none;
		margin: 6px 0 0;
		padding: 0;
	}
	.todo li {
		display: flex;
		align-items: flex-start;
		border-top: 1px solid rgb(246 243 234 / 0.2);
	}
	.todo label {
		flex: 1;
		display: grid;
		grid-template-columns: 30px minmax(0, 1fr);
		gap: 8px;
		padding: 10px 0;
		cursor: pointer;
	}
	.todo input[type='checkbox'] {
		width: 24px;
		height: 24px;
		margin: 1px 0 0;
		accent-color: var(--smor);
	}
	.todo b {
		color: var(--smor);
		text-transform: uppercase;
		font-size: 13px;
		letter-spacing: 0.05em;
		margin-right: 4px;
	}
	.klar {
		text-decoration: line-through;
		opacity: 0.45;
	}
	.x {
		background: none;
		border: 0;
		color: inherit;
		opacity: 0.4;
		font-size: 20px;
		min-width: 40px;
		min-height: 40px;
		cursor: pointer;
	}
	.x:hover {
		opacity: 1;
	}
	form {
		display: flex;
		gap: 6px;
		margin-top: 8px;
	}
	form input {
		background: transparent;
		border: 1px solid rgb(246 243 234 / 0.35);
		color: inherit;
		padding: 8px 10px;
		min-width: 0;
	}
	.dagfalt {
		width: 5em;
	}
	.textfalt {
		flex: 1;
	}
	.ut,
	.veckor {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.kort {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 10px;
	}
	.veckor > div {
		border-top: 2px solid var(--color-svart);
	}
	.vecka {
		all: unset;
		box-sizing: border-box;
		width: 100%;
		display: grid;
		grid-template-columns: 5em minmax(0, 1fr);
		gap: 12px;
		padding: 10px 6px;
		border-bottom: 1px solid var(--color-linje);
		cursor: pointer;
	}
	.vecka:hover {
		background: var(--kort);
	}
	.vecka:focus-visible {
		outline: 2px solid var(--color-oxblod);
	}
	.vecka.nu {
		background: var(--smor);
		color: var(--smor-text);
	}
	.vecka.vald {
		box-shadow: inset 4px 0 0 var(--color-svart);
	}
	.n {
		font-weight: 900;
		font-size: 18px;
	}
	.n small {
		display: block;
		font-weight: 600;
		font-size: 12px;
		opacity: 0.7;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		align-self: center;
	}
	.vecka.nu .chip {
		border-color: currentColor;
	}
	@media (max-width: 520px) {
		.handelser li {
			grid-template-columns: 1fr;
			gap: 0;
		}
	}
</style>
