<script lang="ts">
	import type { Piece } from './types';
	import { STATUS, PELARE, FORMAT, KANALER, namnFor } from './types';
	import { tidpunkt } from './datum';
	import { andra } from './store.svelte';

	let { piece, oppna }: { piece: Piece; oppna: (p: Piece) => void } = $props();

	// Inlägg filmas och klipps inte, så de hoppar direkt till schemalagd.
	const steg = $derived(
		STATUS.filter((s) => piece.typ === 'film' || !['filmad', 'klippt'].includes(s.id))
	);
	const nasta = $derived(steg[steg.findIndex((s) => s.id === piece.status) + 1]);
</script>

<article class="kort" class:ute={piece.status === 'ute'}>
	<button class="titel" type="button" onclick={() => oppna(piece)}>{piece.titel}</button>
	<div class="meta">
		{#if piece.planerad}<span class="chip smor">{tidpunkt(piece.planerad)}</span>{/if}
		{#if piece.pelare}<span class="chip">{namnFor(PELARE, piece.pelare)}</span>{/if}
		{#if piece.format}<span class="chip">{namnFor(FORMAT, piece.format)}</span>{/if}
		{#each piece.kanaler as k (k)}<span class="chip">{namnFor(KANALER, k)}</span>{/each}
	</div>
	{#if piece.anteckning}<p class="ant">{piece.anteckning}</p>{/if}
	{#if nasta}
		<button class="knapp liten" type="button" onclick={() => andra('hub_pieces', piece.id, { status: nasta.id })}>
			{nasta.namn} <span aria-hidden="true">→</span>
		</button>
	{/if}
</article>

<style>
	.kort {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 12px;
		background: var(--kort);
		border: 1px solid var(--color-linje);
	}
	.kort.ute {
		opacity: 0.75;
	}
	.titel {
		all: unset;
		cursor: pointer;
		font-weight: 700;
		line-height: 1.3;
	}
	.titel:hover {
		text-decoration: underline;
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}
	.ant {
		margin: 0;
		font-size: 14px;
		color: var(--color-grafit);
	}
	.knapp {
		align-self: flex-start;
	}
</style>
