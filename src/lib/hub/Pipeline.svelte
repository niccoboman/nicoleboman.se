<script lang="ts">
	import type { Piece, Status } from './types';
	import { hub } from './store.svelte';
	import PieceCard from './PieceCard.svelte';

	let { oppna }: { oppna: (p: Piece) => void } = $props();

	let visa = $state<'alla' | 'film' | 'inlagg'>('alla');

	const KOLUMNER: { id: Status; namn: string; tom: string }[] = [
		{ id: 'ide', namn: 'Planerad', tom: 'Ge en idé en tid så hamnar den här.' },
		{ id: 'filmad', namn: 'Filmad', tom: 'Inget filmat som väntar.' },
		{ id: 'klippt', namn: 'Klippt', tom: 'Inget som väntar på dig.' },
		{ id: 'schemalagd', namn: 'Schemalagd', tom: 'Inget schemalagt.' },
		{ id: 'ute', namn: 'Ute', tom: 'Inget ute än.' }
	];

	function kolumn(id: Status) {
		return hub.hub_pieces
			.filter((p) => p.status === id && (visa === 'alla' || p.typ === visa) && (id !== 'ide' || p.planerad))
			.sort((a, b) =>
				id === 'ute'
					? (b.postad ?? b.planerad ?? '').localeCompare(a.postad ?? a.planerad ?? '')
					: (a.planerad ?? '9').localeCompare(b.planerad ?? '9')
			);
	}
</script>

<div class="filter" role="group" aria-label="Visa">
	{#each [['alla', 'Allt'], ['film', 'Filmer'], ['inlagg', 'LinkedIn-inlägg']] as [id, namn] (id)}
		<button type="button" class="knapp liten" class:fylld={visa === id} aria-pressed={visa === id} onclick={() => (visa = id as typeof visa)}>{namn}</button>
	{/each}
</div>

<div class="tavla">
	{#each KOLUMNER as k (k.id)}
		{@const lista = kolumn(k.id)}
		<section class="kol" aria-labelledby="kol-{k.id}">
			<h2 id="kol-{k.id}" class="rubrik">{k.namn} <span class="dampad">{lista.length}</span></h2>
			{#each lista.slice(0, k.id === 'ute' ? 12 : 99) as p (p.id)}<PieceCard piece={p} {oppna} />{:else}<p class="tom">{k.tom}</p>{/each}
		</section>
	{/each}
</div>

<style>
	.filter {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}
	.tavla {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 12px;
		overflow-x: auto;
		padding-bottom: 8px;
	}
	.kol {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}
	.kol h2 {
		font-size: 22px;
		border-bottom: 2px solid var(--color-svart);
		padding-bottom: 4px;
	}
	@media (max-width: 900px) {
		.tavla {
			grid-template-columns: 1fr;
			overflow: visible;
		}
	}
</style>
