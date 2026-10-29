<script lang="ts">
	import type { Piece, Status } from './types';
	import { PELARE, namnFor, nastaSteg, pelarFarg, plattform } from './types';
	import { hub, stega } from './store.svelte';
	import { dagnamn, kort, iso, fran } from './datum';

	let { oppna }: { oppna: (p: Piece) => void } = $props();

	// Kanban efter vad som ska göras härnäst. Brickans form visar typen (film = stående skärm,
	// inlägg = linjerat papper) och fyllningen visar hur långt den kommit.
	const KOLUMNER: { id: string; namn: string; status: Status[] }[] = [
		{ id: 'gora', namn: 'Att filma & skriva', status: ['ide'] },
		{ id: 'klippa', namn: 'Att klippa', status: ['filmad'] },
		{ id: 'schema', namn: 'Att schemalägga', status: ['klippt'] },
		{ id: 'klar', namn: 'Klar', status: ['schemalagd'] }
	];

	const planerade = $derived(
		hub.hub_pieces.filter((p) => p.planerad && p.status !== 'ute' && p.status !== 'inkorg').sort((a, b) => a.planerad!.localeCompare(b.planerad!))
	);
	const idag = iso(new Date());

	// Filmer som inte är filmade: det första filmblocket från i dag fram till publiceringen.
	const filmblock = $derived(hub.hub_events.filter((e) => e.typ === 'filmblock').sort((a, b) => a.datum.localeCompare(b.datum)));
	function filmas(p: Piece) {
		if (p.typ !== 'film' || p.status !== 'ide') return '';
		const fb = filmblock.find((e) => e.datum >= idag && e.datum <= p.planerad!.slice(0, 10));
		return fb ? `Filmblock ${dagnamn(fran(fb.datum))} ${kort(fran(fb.datum))}` : 'Inget filmblock före';
	}

	const ute = $derived(
		hub.hub_pieces.filter((p) => p.status === 'ute').sort((a, b) => (b.postad ?? b.planerad ?? '').localeCompare(a.postad ?? a.planerad ?? ''))
	);
	let visaUte = $state(false);

	const klocka = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
</script>

<header class="topp">
	<h1 class="serif">Det som <em>ska ut</em></h1>
	<dl class="legend" aria-label="Så läser du brickorna">
		<div><dt><span class="mini film ide"></span></dt><dd>Film, ej filmad</dd></div>
		<div><dt><span class="mini film filmad"></span></dt><dd>Filmad</dd></div>
		<div><dt><span class="mini film klippt"></span></dt><dd>Klippt</dd></div>
		<div><dt><span class="mini inlagg"></span></dt><dd>LinkedIn-inlägg</dd></div>
		<div><dt><span class="mini klar"></span></dt><dd>Klar</dd></div>
	</dl>
	<ul class="pelare" aria-label="Pelare">
		{#each PELARE as pe (pe.id)}
			<li><span style:background={pelarFarg(pe.id)}></span>{pe.namn}</li>
		{/each}
	</ul>
</header>

<div class="tavla">
	{#each KOLUMNER as k (k.id)}
		{@const bitar = planerade.filter((p) => k.status.includes(p.status))}
		<section class="kolumn" aria-label={k.namn}>
			<h2 class="serif">{k.namn}<span>{bitar.length}</span></h2>
			{#each bitar as p (p.id)}
				{@const d = new Date(p.planerad!)}
				{@const nasta = nastaSteg(p)}
				{@const hint = filmas(p)}
				{@const sen = p.planerad!.slice(0, 10) < idag}
				<article class="bricka {p.typ} {p.status}" style:--pf={pelarFarg(p.pelare)}>
					<p class="kat">{p.pelare ? namnFor(PELARE, p.pelare) : p.typ === 'inlagg' ? 'LinkedIn' : 'Utan pelare'}</p>
					<button type="button" class="titel serif" onclick={() => oppna(p)}>{p.titel}</button>
					<p class="nar" class:sen>
						<b>{dagnamn(d)} {kort(d)}</b> · {klocka(d)}{sen ? ' · försenad' : ''}
					</p>
					<p class="var">{plattform(p)}</p>
					{#if hint}<p class="hint">{hint}</p>{/if}
					{#if p.status === 'schemalagd'}<span class="stampel">Klar</span>{/if}
					{#if nasta}
						<button type="button" class="nasta" onclick={() => stega(p.id, nasta.id, nasta.namn)}>→ {nasta.namn.toLowerCase()}</button>
					{/if}
				</article>
			{:else}
				<p class="tom">Inget här.</p>
			{/each}
		</section>
	{/each}
</div>

{#if ute.length}
	<button type="button" class="visa" onclick={() => (visaUte = !visaUte)}>{visaUte ? 'Dölj' : 'Visa'} det som är ute ({ute.length})</button>
	{#if visaUte}
		<ol class="ute">
			{#each ute as p (p.id)}
				{@const d = new Date((p.postad ?? p.planerad)!)}
				<li style:--pf={pelarFarg(p.pelare)}>
					<span>{dagnamn(d)} {kort(d)}</span>
					<button type="button" class="serif" onclick={() => oppna(p)}>{p.titel}</button>
					<small>{plattform(p)}</small>
				</li>
			{/each}
		</ol>
	{/if}
{/if}

<style>
	.serif {
		font-family: 'Instrument Serif', Georgia, serif;
		font-weight: 400;
		text-transform: none;
		letter-spacing: 0;
	}
	.topp {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	h1 {
		font-size: clamp(48px, 8vw, 88px);
		line-height: 0.95;
	}
	h1 em {
		font-style: italic;
	}
	.legend {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 10px 22px;
		font-size: 13px;
		color: var(--color-grafit);
	}
	.legend div {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.legend dt,
	.legend dd {
		margin: 0;
	}
	.mini {
		display: block;
		width: 16px;
		height: 22px;
	}
	.pelare {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 6px 20px;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.pelare li {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.pelare span {
		width: 18px;
		height: 4px;
	}

	.tavla {
		display: grid;
		grid-template-columns: repeat(4, minmax(220px, 1fr));
		gap: 18px;
		overflow-x: auto;
		padding-bottom: 8px;
		scroll-snap-type: x mandatory;
	}
	.kolumn {
		display: flex;
		flex-direction: column;
		gap: 12px;
		scroll-snap-align: start;
	}
	.kolumn h2 {
		font-size: 30px;
		line-height: 1.1;
		padding-bottom: 8px;
		border-bottom: 1px solid var(--color-svart);
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.kolumn h2 span {
		font-family: 'Fragment Mono', monospace;
		font-size: 13px;
		color: var(--color-grafit);
	}

	/* Brickan. Film = stående skärm med inre ram, inlägg = linjerat papper. */
	.bricka {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 0 14px 12px;
		min-height: 200px;
		border-top: 5px solid var(--pf);
		color: var(--color-svart);
	}
	.bricka.film {
		box-shadow: inset 0 0 0 1px var(--color-linje);
		outline: 1px solid var(--color-linje);
		outline-offset: 4px;
		margin: 5px;
	}
	.bricka.inlagg:not(.schemalagd) .kat {
		color: var(--color-grafit);
	}
	.bricka.inlagg {
		background: repeating-linear-gradient(transparent 0 25px, color-mix(in srgb, var(--color-linje) 45%, transparent) 25px 26px);
		box-shadow: inset 0 0 0 1px var(--color-linje);
	}
	/* Fyllningen visar hur långt den kommit */
	.bricka.ide.film,
	.mini.film.ide {
		box-shadow: none;
		border-left: 1.5px dashed var(--color-grafit);
		border-right: 1.5px dashed var(--color-grafit);
		border-bottom: 1.5px dashed var(--color-grafit);
		background: transparent;
	}
	.bricka.filmad,
	.mini.filmad {
		background: color-mix(in srgb, var(--color-svart) 12%, var(--color-krita));
	}
	.bricka.klippt,
	.mini.klippt {
		background: color-mix(in srgb, var(--color-svart) 26%, var(--color-krita));
	}
	.bricka.schemalagd,
	.mini.klar {
		background: #f3ecdf;
		color: #17150f;
		--color-grafit: #6b645a;
	}
	.mini.film.ide {
		border-top: 1.5px dashed var(--color-grafit);
	}
	.mini.inlagg {
		background: repeating-linear-gradient(transparent 0 4px, var(--color-grafit) 4px 5px);
		box-shadow: inset 0 0 0 1px var(--color-grafit);
	}
	.mini.filmad,
	.mini.klippt {
		box-shadow: inset 0 0 0 1px var(--color-linje);
	}

	.kat {
		margin: 10px 0 0;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--pf);
	}
	.schemalagd .kat {
		color: #17150f;
	}
	.titel {
		all: unset;
		cursor: pointer;
		font-family: 'Instrument Serif', Georgia, serif;
		font-size: 25px;
		line-height: 1.1;
		flex: 1;
	}
	.titel:hover {
		text-decoration: underline;
		text-decoration-thickness: 1px;
	}
	.titel:focus-visible,
	.nasta:focus-visible {
		outline: 2px solid var(--color-oxblod);
	}
	.nar,
	.var,
	.hint {
		margin: 0;
		font-size: 13px;
		color: var(--color-grafit);
	}
	.nar b {
		color: inherit;
		font-weight: 700;
	}
	.nar b::first-letter {
		text-transform: uppercase;
	}
	.nar.sen {
		color: var(--p-omdome);
	}
	.var {
		font-family: 'Fragment Mono', monospace;
		font-size: 12px;
	}
	.hint {
		font-style: italic;
		font-family: 'Instrument Serif', Georgia, serif;
		font-size: 16px;
	}
	.stampel {
		position: absolute;
		top: 14px;
		right: 10px;
		transform: rotate(-8deg);
		border: 2px solid #801220;
		color: #801220;
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		padding: 2px 6px;
	}
	.nasta {
		align-self: flex-start;
		margin-top: 4px;
		background: none;
		border: 0;
		border-bottom: 1px solid currentColor;
		padding: 2px 0;
		font-size: 13px;
		font-weight: 600;
		color: inherit;
		cursor: pointer;
	}
	.tom {
		margin: 0;
		font-family: 'Instrument Serif', Georgia, serif;
		font-style: italic;
		font-size: 18px;
		color: var(--color-grafit);
	}
	.visa {
		align-self: flex-start;
		background: none;
		border: 0;
		padding: 0;
		color: var(--color-grafit);
		text-decoration: underline;
		cursor: pointer;
		font-size: 15px;
	}
	.ute {
		list-style: none;
		margin: 0;
		padding: 0;
		max-width: 720px;
	}
	.ute li {
		display: grid;
		grid-template-columns: 6em minmax(0, 1fr) auto;
		gap: 14px;
		align-items: baseline;
		padding: 10px 0 10px 12px;
		border-left: 4px solid var(--pf);
		opacity: 0.7;
	}
	.ute li span,
	.ute small {
		font-size: 13px;
		color: var(--color-grafit);
	}
	.ute button {
		all: unset;
		cursor: pointer;
		font-size: 21px;
	}
	@media (max-width: 760px) {
		.tavla {
			grid-template-columns: repeat(4, 78vw);
		}
	}
</style>
