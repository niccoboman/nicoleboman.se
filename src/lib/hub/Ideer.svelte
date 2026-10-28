<script lang="ts">
	import type { Piece, Pelare } from './types';
	import { PELARE } from './types';
	import { hub, lagg } from './store.svelte';
	import PieceCard from './PieceCard.svelte';

	let { oppna }: { oppna: (p: Piece) => void } = $props();

	// Idéer = inkorg + idéer som inte fått en tid än. Planerade idéer syns i Pipeline.
	const ideer = $derived(hub.hub_pieces.filter((p) => p.status === 'inkorg' || (p.status === 'ide' && !p.planerad)));
	const inkorg = $derived(ideer.filter((p) => p.status === 'inkorg' || !p.pelare));
	const perPelare = (id: Pelare) => ideer.filter((p) => p.status === 'ide' && p.pelare === id);

	let tanke = $state('');
	let pelare = $state<Pelare | ''>('');
	async function fanga(e: SubmitEvent) {
		e.preventDefault();
		const t = tanke.trim();
		if (!t) return;
		const [forsta, ...resten] = t.split('\n');
		await lagg('hub_pieces', {
			status: pelare ? 'ide' : 'inkorg',
			typ: 'film',
			pelare: pelare || null,
			kanaler: ['tiktok', 'reels'],
			titel: forsta.slice(0, 300),
			text: resten.join('\n').trim(),
			anteckning: '',
			format: null,
			fil: null,
			projekt: null,
			planerad: null,
			postad: null,
			siffror: {}
		});
		tanke = '';
	}
</script>

<form class="fanga" onsubmit={fanga}>
	<label for="tanke" class="rubrik">Fånga en tanke</label>
	<textarea
		id="tanke"
		class="falt"
		rows="3"
		bind:value={tanke}
		placeholder="Första raden blir kroken. Diktera gärna."
		onkeydown={(e) => (e.metaKey || e.ctrlKey) && e.key === 'Enter' && e.currentTarget.form?.requestSubmit()}
	></textarea>
	<div class="rad">
		<select class="falt" bind:value={pelare} aria-label="Pelare">
			<option value="">Sortera sen</option>
			{#each PELARE as p (p.id)}<option value={p.id}>{p.namn}</option>{/each}
		</select>
		<button class="knapp fylld" type="submit">Spara</button>
	</div>
</form>

{#if inkorg.length}
	<section class="grupp">
		<h2 class="rubrik">Inkorg <span class="dampad">{inkorg.length}</span></h2>
		<p class="dampad">Säg "sortera inkorgen" till Claude, eller öppna en och välj pelare.</p>
		<div class="kort">{#each inkorg as p (p.id)}<PieceCard piece={p} {oppna} />{/each}</div>
	</section>
{/if}

{#each PELARE as pel (pel.id)}
	{@const lista = perPelare(pel.id)}
	<section class="grupp">
		<h2 class="rubrik">{pel.namn} <span class="dampad">{lista.length}</span></h2>
		<p class="dampad">{pel.dag}</p>
		{#if lista.length}
			<div class="kort">{#each lista as p (p.id)}<PieceCard piece={p} {oppna} />{/each}</div>
		{:else}
			<p class="tom">Inga idéer här än.</p>
		{/if}
	</section>
{/each}

<style>
	.fanga {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 18px;
		background: var(--smor);
		color: var(--smor-text);
	}
	.fanga .falt {
		background: #fff;
		color: #17150f;
		border-color: #17150f;
	}
	.fanga label {
		font-size: 26px;
	}
	.fanga .knapp.fylld {
		background: #17150f;
		color: #fff;
		border-color: #17150f;
	}
	.rad {
		display: flex;
		gap: 8px;
	}
	.rad select {
		flex: 1;
	}
	.grupp {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.grupp h2 {
		font-size: 26px;
	}
	.grupp > p {
		margin: 0;
		font-size: 15px;
	}
	.kort {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 10px;
	}
</style>
