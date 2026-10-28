<script lang="ts">
	import type { Piece, Pelare } from './types';
	import { PELARE } from './types';
	import { hub, lagg } from './store.svelte';

	let { oppna }: { oppna: (p: Piece) => void } = $props();

	// Idéer = inkorg + idéer utan tid. Med en tid hamnar de i Pipeline.
	const ideer = $derived(hub.hub_pieces.filter((p) => p.status === 'inkorg' || (p.status === 'ide' && !p.planerad)));
	const inkorg = $derived(ideer.filter((p) => p.status === 'inkorg' || !p.pelare));
	const perPelare = (id: Pelare) => ideer.filter((p) => p.status === 'ide' && p.pelare === id);

	let tanke = $state('');
	let sparad = $state(false);
	async function fanga(e: SubmitEvent) {
		e.preventDefault();
		const t = tanke.trim();
		if (!t) return;
		const [forsta, ...resten] = t.split('\n');
		await lagg('hub_pieces', {
			status: 'inkorg',
			typ: 'film',
			titel: forsta.slice(0, 300),
			text: resten.join('\n').trim(),
			anteckning: '',
			format: null,
			pelare: null,
			fil: null,
			planerad: null,
			postad: null
		});
		tanke = '';
		sparad = true;
		setTimeout(() => (sparad = false), 1800);
	}
</script>

<form class="fanga" onsubmit={fanga}>
	<label for="tanke" class="rubrik">Vad tänker du på?</label>
	<textarea
		id="tanke"
		rows="3"
		bind:value={tanke}
		placeholder="Säg det som du skulle säga det i kameran."
		onkeydown={(e) => (e.metaKey || e.ctrlKey) && e.key === 'Enter' && e.currentTarget.form?.requestSubmit()}
	></textarea>
	<div class="rad">
		<span class="tips" aria-live="polite">{sparad ? 'Sparad i inkorgen.' : 'Claude sorterar och skriver en krok.'}</span>
		<button type="submit">Spara</button>
	</div>
</form>

{#if inkorg.length}
	<section class="grupp">
		<h2 class="etikett">Inkorg · {inkorg.length}</h2>
		<ul>{#each inkorg as p (p.id)}<li><button type="button" onclick={() => oppna(p)}>{p.titel}</button></li>{/each}</ul>
	</section>
{/if}

<div class="pelare">
	{#each PELARE as pel (pel.id)}
		{@const lista = perPelare(pel.id)}
		<section class="grupp">
			<h2 class="rubrik">{pel.namn} <span class="dampad">{lista.length}</span></h2>
			<ul>
				{#each lista as p (p.id)}<li><button type="button" onclick={() => oppna(p)}>{p.titel}</button></li>{:else}<li class="tom">Inga idéer än.</li>{/each}
			</ul>
		</section>
	{/each}
</div>

<style>
	.fanga {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 22px;
		background: var(--smor);
		color: #17150f;
	}
	.fanga label {
		font-size: clamp(30px, 5vw, 44px);
	}
	.fanga textarea {
		width: 100%;
		background: transparent;
		border: 0;
		border-bottom: 2px solid #17150f;
		color: #17150f;
		font-size: 20px;
		padding: 6px 0;
		resize: vertical;
	}
	.fanga textarea::placeholder {
		color: rgb(23 21 15 / 0.5);
	}
	.fanga textarea:focus-visible {
		outline: none;
	}
	.rad {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}
	.tips {
		font-size: 14px;
		opacity: 0.75;
	}
	.fanga button {
		background: #17150f;
		color: #fff;
		border: 0;
		padding: 10px 22px;
		min-height: 44px;
		font-weight: 800;
		cursor: pointer;
	}
	.pelare {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 32px 28px;
	}
	.grupp h2.rubrik {
		font-size: 28px;
		border-bottom: 2px solid var(--color-svart);
		padding-bottom: 4px;
	}
	.grupp h2.etikett {
		margin-bottom: 4px;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	li {
		border-bottom: 1px solid var(--color-linje);
	}
	li button {
		all: unset;
		box-sizing: border-box;
		display: block;
		width: 100%;
		padding: 10px 0;
		cursor: pointer;
		line-height: 1.35;
	}
	li button:hover {
		text-decoration: underline;
	}
	li button:focus-visible {
		outline: 2px solid var(--color-oxblod);
	}
	li.tom {
		border: 0;
	}
	@media (max-width: 700px) {
		.pelare {
			grid-template-columns: 1fr;
		}
	}
</style>
