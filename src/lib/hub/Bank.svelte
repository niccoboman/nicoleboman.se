<script lang="ts">
	import { hub, lagg, andra, tabort } from './store.svelte';
	import { iso, fran, kort } from './datum';

	let visaAnvant = $state(false);
	const lista = $derived(
		hub.hub_bank
			.filter((b) => visaAnvant || !b.anvand)
			.sort((a, b) => (b.filmad ?? b.created_at).localeCompare(a.filmad ?? a.created_at))
	);
	const oanvant = $derived(hub.hub_bank.filter((b) => !b.anvand).length);

	let beskrivning = $state('');
	let plats = $state('');
	let filmad = $state(iso(new Date()));
	async function spara(e: SubmitEvent) {
		e.preventDefault();
		if (!beskrivning.trim()) return;
		await lagg('hub_bank', {
			beskrivning: beskrivning.trim(),
			plats: plats.trim() || null,
			projekt: null,
			filmad: filmad || null,
			taggar: [],
			anvand: false
		});
		beskrivning = '';
		plats = '';
	}
</script>

<section class="intro">
	<h2 class="rubrik">Banken <span class="dampad">{oanvant} oanvända</span></h2>
	<p class="dampad">Allt filmat material som inte blivit film än. Filmerna ligger kvar på din Mac; här står var. /klipp fyller på när den klipper.</p>
</section>

<form class="ny" onsubmit={spara}>
	<input class="falt" bind:value={beskrivning} placeholder="Vad är det? T.ex. 'B-roll från Del 2, händer och skärmar'" aria-label="Beskrivning" />
	<div class="rad">
		<input class="falt" bind:value={plats} placeholder="Var ligger det? ~/Downloads/IMG_…" aria-label="Plats" />
		<input class="falt datum" type="date" bind:value={filmad} aria-label="Filmat" />
		<button class="knapp fylld" type="submit">Lägg till</button>
	</div>
</form>

<label class="vaxel"><input type="checkbox" bind:checked={visaAnvant} /> Visa också använt</label>

<ul class="lista">
	{#each lista as b (b.id)}
		<li class:anvand={b.anvand}>
			<div>
				<p class="besk">{b.beskrivning}</p>
				<p class="dampad meta">
					{#if b.filmad}{kort(fran(b.filmad))}{/if}
					{#if b.plats} · <code>{b.plats}</code>{/if}
					{#if b.projekt} · {b.projekt}{/if}
				</p>
			</div>
			<div class="knappar">
				<button type="button" class="knapp liten" onclick={() => andra('hub_bank', b.id, { anvand: !b.anvand })}>{b.anvand ? 'Oanvänd' : 'Använd'}</button>
				<button type="button" class="knapp liten" aria-label="Ta bort {b.beskrivning}" onclick={() => tabort('hub_bank', b.id)}>×</button>
			</div>
		</li>
	{:else}
		<li class="tom">Banken är tom.</li>
	{/each}
</ul>

<style>
	.intro {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.intro h2 {
		font-size: 32px;
	}
	.intro p {
		margin: 0;
		max-width: 60ch;
	}
	.ny {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.rad {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}
	.rad .falt {
		flex: 1;
		min-width: 12em;
	}
	.rad .datum {
		flex: 0 0 11em;
		min-width: 0;
	}
	.vaxel {
		display: flex;
		gap: 8px;
		align-items: center;
		font-size: 15px;
	}
	.lista {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 2px solid var(--color-svart);
	}
	.lista li {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 0;
		border-bottom: 1px solid var(--color-linje);
	}
	.lista li.anvand {
		opacity: 0.5;
	}
	.besk {
		margin: 0;
		font-weight: 600;
	}
	.meta {
		margin: 2px 0 0;
		font-size: 14px;
		overflow-wrap: anywhere;
	}
	code {
		font-size: 13px;
	}
	.knappar {
		display: flex;
		gap: 6px;
		align-items: flex-start;
		flex: none;
	}
</style>
