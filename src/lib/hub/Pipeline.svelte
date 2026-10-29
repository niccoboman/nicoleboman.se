<script lang="ts">
	import type { Piece } from './types';
	import { PELARE, FORMAT, namnFor, nastaSteg, pelarFarg, plattform, attGora, stegFor } from './types';
	import { hub, stega } from './store.svelte';
	import { dagnamn, kort, mandag, iso, fran, plusDagar, veckonummer, spann } from './datum';

	let { oppna }: { oppna: (p: Piece) => void } = $props();

	// En lista i tidsordning, grupperad per vecka: det som ska ut härnäst står överst.
	const kommande = $derived(
		hub.hub_pieces
			.filter((p) => p.planerad && p.status !== 'ute' && p.status !== 'inkorg')
			.sort((a, b) => a.planerad!.localeCompare(b.planerad!))
	);
	const denna = iso(mandag(new Date()));
	const veckor = $derived.by(() => {
		const g: { mandag: string; bitar: Piece[] }[] = [];
		for (const p of kommande) {
			const m = iso(mandag(new Date(p.planerad!)));
			if (g.at(-1)?.mandag !== m) g.push({ mandag: m, bitar: [] });
			g.at(-1)!.bitar.push(p);
		}
		return g;
	});
	const veckoNamn = (m: string) => {
		const d = fran(m);
		const nr = `v${veckonummer(d)}`;
		if (m < denna) return `Försenat`;
		if (m === denna) return `Den här veckan · ${nr}`;
		if (m === iso(plusDagar(fran(denna), 7))) return `Nästa vecka · ${nr}`;
		return `${nr} · ${spann(d)}`;
	};

	// Filmer som inte är filmade: vilket filmblock hinner de med? Det första från i dag fram till publiceringen.
	const filmblock = $derived(
		hub.hub_events.filter((e) => e.typ === 'filmblock').sort((a, b) => a.datum.localeCompare(b.datum))
	);
	function filmas(p: Piece) {
		if (p.typ !== 'film' || p.status !== 'ide') return '';
		const idag = iso(new Date());
		const fb = filmblock.find((e) => e.datum >= idag && e.datum <= p.planerad!.slice(0, 10));
		return fb ? `Filmas i filmblocket ${dagnamn(fran(fb.datum))} ${kort(fran(fb.datum))}` : 'Inget filmblock före, filma när det passar';
	}

	const ute = $derived(
		hub.hub_pieces
			.filter((p) => p.status === 'ute')
			.sort((a, b) => (b.postad ?? b.planerad ?? '').localeCompare(a.postad ?? a.planerad ?? ''))
	);
	let visaUte = $state(false);

	const klocka = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
</script>

<h1 class="rubrik">Det som ska ut</h1>

<ul class="forklaring" aria-label="Pelare">
	{#each PELARE as pe (pe.id)}
		<li><span class="prick" style:background={pelarFarg(pe.id)}></span>{pe.namn}</li>
	{/each}
</ul>

{#each veckor as v (v.mandag)}
	<section class="vecka" aria-label={veckoNamn(v.mandag)}>
		<h2 class="veckonamn" class:forsenat={v.mandag < denna}>{veckoNamn(v.mandag)}</h2>
		<ol class="lista">
			{#each v.bitar as p (p.id)}
				{@const d = new Date(p.planerad!)}
				{@const nasta = nastaSteg(p)}
				{@const steg = stegFor(p)}
				{@const nu = steg.findIndex((s) => s.id === p.status)}
				{@const hint = filmas(p)}
				<li style:--pf={pelarFarg(p.pelare)}>
					<div class="datum" aria-label="{dagnamn(d)} {kort(d)} {klocka(d)}">
						<span class="dag">{dagnamn(d)}</span>
						<span class="nr">{d.getDate()}</span>
						<span class="kl">{klocka(d)}</span>
					</div>
					<div class="mitt">
						<button type="button" class="titel" onclick={() => oppna(p)}>{p.titel}</button>
						<p class="meta">
							{#if p.pelare}<span class="pelare"><span class="prick"></span>{namnFor(PELARE, p.pelare)}</span>{/if}
							<span class="plattform">{plattform(p)}</span>
							{#if p.format}<span>{namnFor(FORMAT, p.format)}</span>{/if}
						</p>
						{#if hint}<p class="hint">{hint}</p>{/if}
					</div>
					<div class="status">
						<span class="gora" data-status={p.status}>{attGora(p)}</span>
						<span class="steg" aria-label="Steg {nu + 1} av {steg.length}">
							{#each steg as s, i (s.id)}<span class:klar={i <= nu} title={s.namn}></span>{/each}
						</span>
						{#if nasta}
							<button type="button" class="nasta" onclick={() => stega(p.id, nasta.id, nasta.namn)}
								>Markera {nasta.namn.toLowerCase()}</button
							>
						{/if}
					</div>
				</li>
			{/each}
		</ol>
	</section>
{:else}
	<p class="tom">Inget planerat. Ge en idé en tid så hamnar den här.</p>
{/each}

{#if ute.length}
	<button type="button" class="visa" onclick={() => (visaUte = !visaUte)}>{visaUte ? 'Dölj' : 'Visa'} det som är ute ({ute.length})</button>
	{#if visaUte}
		<ol class="lista ute">
			{#each ute as p (p.id)}
				{@const d = new Date((p.postad ?? p.planerad)!)}
				<li style:--pf={pelarFarg(p.pelare)}>
					<div class="datum"><span class="dag">{dagnamn(d)}</span><span class="nr">{d.getDate()}</span><span class="kl">{kort(d).split(' ')[1]}</span></div>
					<div class="mitt">
						<button type="button" class="titel" onclick={() => oppna(p)}>{p.titel}</button>
						<p class="meta"><span class="plattform">{plattform(p)}</span></p>
					</div>
				</li>
			{/each}
		</ol>
	{/if}
{/if}

<style>
	h1 {
		font-size: clamp(36px, 6vw, 56px);
	}
	.forklaring {
		list-style: none;
		margin: -16px 0 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 6px 18px;
		font-size: 14px;
		color: var(--color-grafit);
	}
	.forklaring li {
		display: flex;
		align-items: center;
		gap: 7px;
	}
	.prick {
		display: inline-block;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--pf);
		flex: none;
	}
	.vecka {
		max-width: 820px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.veckonamn {
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-grafit);
	}
	.veckonamn.forsenat {
		color: var(--p-omdome);
	}
	.lista {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.lista li {
		display: grid;
		grid-template-columns: 4.2em minmax(0, 1fr) auto;
		gap: 4px 18px;
		align-items: start;
		padding: 14px 16px 14px 14px;
		background: var(--kort);
		border-left: 5px solid var(--pf);
	}
	.datum {
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 1.1;
	}
	.dag,
	.kl {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-grafit);
	}
	.nr {
		font-family: 'Anton', 'Archivo', sans-serif;
		font-size: 30px;
		line-height: 1.15;
	}
	.mitt {
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-width: 0;
	}
	.titel {
		all: unset;
		cursor: pointer;
		font-size: 19px;
		font-weight: 600;
		line-height: 1.3;
	}
	.titel:hover {
		text-decoration: underline;
	}
	.titel:focus-visible,
	.nasta:focus-visible {
		outline: 2px solid var(--color-oxblod);
	}
	.meta {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 4px 14px;
		font-size: 14px;
		color: var(--color-grafit);
	}
	.pelare {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: var(--color-svart);
		font-weight: 600;
	}
	.plattform {
		font-weight: 600;
		color: var(--color-svart);
	}
	.hint {
		margin: 0;
		font-size: 14px;
		color: var(--color-grafit);
	}
	.hint::before {
		content: '● ';
		color: var(--pf);
	}
	.status {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 6px;
	}
	.gora {
		font-size: 13px;
		font-weight: 700;
		padding: 3px 9px;
		border: 1px solid var(--color-linje);
		white-space: nowrap;
	}
	.gora[data-status='schemalagd'] {
		background: var(--smor);
		border-color: var(--smor);
		color: var(--smor-text);
	}
	.steg {
		display: flex;
		gap: 3px;
	}
	.steg span {
		width: 14px;
		height: 4px;
		background: var(--color-linje);
	}
	.steg span.klar {
		background: var(--color-svart);
	}
	.nasta {
		background: none;
		border: 0;
		padding: 2px 0;
		font-size: 14px;
		color: var(--color-grafit);
		cursor: pointer;
		white-space: nowrap;
	}
	.nasta:hover {
		color: var(--color-svart);
		text-decoration: underline;
	}
	.tom {
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
		max-width: 820px;
	}
	.ute li {
		grid-template-columns: 4.2em minmax(0, 1fr);
		opacity: 0.65;
	}
	@media (max-width: 560px) {
		.lista li {
			grid-template-columns: 3.2em minmax(0, 1fr);
			padding: 12px;
			gap: 10px 12px;
		}
		.status {
			grid-column: 2;
			flex-direction: row;
			align-items: center;
			flex-wrap: wrap;
			gap: 10px;
		}
		.nr {
			font-size: 26px;
		}
	}
</style>
