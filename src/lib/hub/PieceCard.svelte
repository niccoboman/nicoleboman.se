<script lang="ts">
	import type { Piece } from './types';
	import { PELARE, namnFor, nastaSteg } from './types';
	import { tidpunkt } from './datum';
	import { andra } from './store.svelte';

	let { piece, oppna }: { piece: Piece; oppna: (p: Piece) => void } = $props();

	const nasta = $derived(nastaSteg(piece));
	const meta = $derived(
		[piece.planerad && tidpunkt(piece.planerad), piece.typ === 'inlagg' ? 'LinkedIn' : namnFor(PELARE, piece.pelare)]
			.filter(Boolean)
			.join(' · ')
	);
</script>

<article class="kort" class:ute={piece.status === 'ute'}>
	<button class="titel" type="button" onclick={() => oppna(piece)}>{piece.titel}</button>
	{#if meta}<p class="meta">{meta}</p>{/if}
	{#if nasta}
		<button class="steg" type="button" onclick={() => andra('hub_pieces', piece.id, { status: nasta.id, ...(nasta.id === 'ute' ? { postad: new Date().toISOString() } : {}) })}>
			{nasta.namn} <span aria-hidden="true">→</span>
		</button>
	{/if}
</article>

<style>
	.kort {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 14px;
		background: var(--kort);
		border-left: 3px solid var(--smor-linje);
	}
	.kort.ute {
		border-left-color: var(--color-linje);
		opacity: 0.6;
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
	.titel:focus-visible,
	.steg:focus-visible {
		outline: 2px solid var(--color-oxblod);
		outline-offset: 2px;
	}
	.meta {
		margin: 0;
		font-size: 14px;
		color: var(--color-grafit);
	}
	.steg {
		align-self: flex-start;
		margin-top: 2px;
		background: none;
		border: 0;
		padding: 4px 0;
		font-size: 14px;
		font-weight: 700;
		cursor: pointer;
		color: var(--color-svart);
	}
	.steg:hover {
		text-decoration: underline;
	}
</style>
