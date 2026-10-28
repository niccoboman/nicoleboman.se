<script lang="ts">
	import type { Piece } from './types';
	import { STATUS, namnFor, nastaSteg } from './types';
	import { hub, andra } from './store.svelte';
	import { dagnamn, kort } from './datum';

	let { oppna }: { oppna: (p: Piece) => void } = $props();

	// En lista i tidsordning i stället för kolumner: det som ska ut härnäst står överst.
	const kommande = $derived(
		hub.hub_pieces
			.filter((p) => p.planerad && p.status !== 'ute' && p.status !== 'inkorg')
			.sort((a, b) => a.planerad!.localeCompare(b.planerad!))
	);
	const ute = $derived(
		hub.hub_pieces
			.filter((p) => p.status === 'ute')
			.sort((a, b) => (b.postad ?? b.planerad ?? '').localeCompare(a.postad ?? a.planerad ?? ''))
	);
	let visaUte = $state(false);

	const tid = (s: string) => {
		const d = new Date(s);
		return { dag: dagnamn(d), datum: kort(d), klocka: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` };
	};
</script>

<h1 class="rubrik">Det som ska ut</h1>

<ol class="lista">
	{#each kommande as p (p.id)}
		{@const t = tid(p.planerad!)}
		{@const nasta = nastaSteg(p)}
		<li>
			<span class="nar"><b style="display:block">{t.dag} {t.datum}</b>{t.klocka}{p.typ === 'inlagg' ? ' · LinkedIn' : ''}</span>
			<button type="button" class="titel" onclick={() => oppna(p)}>{p.titel}</button>
			<span class="status">
				<span class="pill" data-status={p.status}>{p.status === 'ide' ? 'Ej filmad' : namnFor(STATUS, p.status)}</span>
				{#if nasta}
					<button type="button" class="steg" onclick={() => andra('hub_pieces', p.id, { status: nasta.id, ...(nasta.id === 'ute' ? { postad: new Date().toISOString() } : {}) })}
						>→ {nasta.namn.toLowerCase()}</button
					>
				{/if}
			</span>
		</li>
	{:else}
		<li class="tom">Inget planerat. Ge en idé en tid så hamnar den här.</li>
	{/each}
</ol>

{#if ute.length}
	<button type="button" class="visa" onclick={() => (visaUte = !visaUte)}>{visaUte ? 'Dölj' : 'Visa'} det som är ute ({ute.length})</button>
	{#if visaUte}
		<ol class="lista ute">
			{#each ute as p (p.id)}
				{@const t = tid((p.postad ?? p.planerad)!)}
				<li>
					<span class="nar"><b style="display:block">{t.dag} {t.datum}</b>{p.typ === 'inlagg' ? 'LinkedIn' : ''}</span>
					<button type="button" class="titel" onclick={() => oppna(p)}>{p.titel}</button>
				</li>
			{/each}
		</ol>
	{/if}
{/if}

<style>
	h1 {
		font-size: clamp(36px, 6vw, 56px);
	}
	.lista {
		list-style: none;
		margin: -8px 0 0;
		padding: 0;
		max-width: 760px;
	}
	.lista li {
		display: grid;
		grid-template-columns: 7.5em minmax(0, 1fr) auto;
		gap: 4px 18px;
		align-items: baseline;
		padding: 16px 0;
	}
	.lista li + li {
		border-top: 1px solid var(--color-linje);
	}
	.nar {
		display: flex;
		flex-direction: column;
		font-size: 14px;
		color: var(--color-grafit);
	}
	.nar b {
		color: var(--color-svart);
		font-size: 16px;
	}
	.nar b::first-letter {
		text-transform: uppercase;
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
	.steg:focus-visible {
		outline: 2px solid var(--color-oxblod);
	}
	.status {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 4px;
	}
	.pill {
		font-size: 13px;
		font-weight: 700;
		padding: 2px 8px;
		border: 1px solid var(--color-linje);
		white-space: nowrap;
	}
	.pill[data-status='klippt'],
	.pill[data-status='schemalagd'] {
		background: var(--smor);
		border-color: var(--smor);
		color: #17150f;
	}
	.steg {
		background: none;
		border: 0;
		padding: 2px 0;
		font-size: 14px;
		color: var(--color-grafit);
		cursor: pointer;
		white-space: nowrap;
	}
	.steg:hover {
		color: var(--color-svart);
		text-decoration: underline;
	}
	.tom {
		color: var(--color-grafit);
		display: block !important;
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
	.ute li {
		grid-template-columns: 7.5em minmax(0, 1fr);
		opacity: 0.65;
	}
	@media (max-width: 560px) {
		.lista li {
			grid-template-columns: minmax(0, 1fr) auto;
		}
		.nar {
			grid-column: 1 / -1;
			flex-direction: row;
			gap: 8px;
		}
		.ute li {
			grid-template-columns: 1fr;
		}
	}
</style>
