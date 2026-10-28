<script lang="ts">
	import type { Piece, Status } from './types';
	import { hub } from './store.svelte';
	import PieceCard from './PieceCard.svelte';

	let { oppna }: { oppna: (p: Piece) => void } = $props();

	const KOLUMNER: { id: Status; namn: string; tom: string }[] = [
		{ id: 'ide', namn: 'Planerad', tom: 'Ge en idé en tid så hamnar den här.' },
		{ id: 'filmad', namn: 'Filmad', tom: 'Inget som väntar på klipp.' },
		{ id: 'klippt', namn: 'Klippt', tom: 'Inget som väntar på dig.' },
		{ id: 'schemalagd', namn: 'Schemalagd', tom: 'Inget schemalagt.' },
		{ id: 'ute', namn: 'Ute', tom: 'Snart.' }
	];

	function kolumn(id: Status) {
		return hub.hub_pieces
			.filter((p) => p.status === id && (id !== 'ide' || p.planerad))
			.sort((a, b) =>
				id === 'ute'
					? (b.postad ?? b.planerad ?? '').localeCompare(a.postad ?? a.planerad ?? '')
					: (a.planerad ?? '9').localeCompare(b.planerad ?? '9')
			);
	}
</script>

<div class="tavla">
	{#each KOLUMNER as k (k.id)}
		{@const lista = kolumn(k.id)}
		<section class="kol" aria-labelledby="kol-{k.id}">
			<h2 id="kol-{k.id}" class="rubrik">{k.namn} <span class="dampad">{lista.length}</span></h2>
			{#each lista.slice(0, k.id === 'ute' ? 8 : 99) as p (p.id)}<PieceCard piece={p} {oppna} />{:else}<p class="tom">{k.tom}</p>{/each}
		</section>
	{/each}
</div>

<style>
	.tavla {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 14px;
	}
	.kol {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}
	.kol h2 {
		font-size: 24px;
		border-bottom: 2px solid var(--color-svart);
		padding-bottom: 4px;
	}
	@media (max-width: 900px) {
		.tavla {
			grid-template-columns: 1fr;
			gap: 28px;
		}
	}
</style>
