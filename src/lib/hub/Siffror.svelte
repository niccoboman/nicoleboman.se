<script lang="ts">
	import type { Piece, Stat } from './types';
	import { KANALER, namnFor } from './types';
	import { hub, lagg } from './store.svelte';
	import { iso, fran, kort } from './datum';

	let { oppna }: { oppna: (p: Piece) => void } = $props();

	const MAL = 1000;
	const senaste = (kanal: Stat['kanal']) =>
		hub.hub_stats.filter((s) => s.kanal === kanal).sort((a, b) => b.datum.localeCompare(a.datum))[0];
	const tiktok = $derived(senaste('tiktok')?.foljare ?? 0);
	const andel = $derived(Math.min(100, (tiktok / MAL) * 100));
	const dagarKvar = $derived(Math.max(0, Math.ceil((fran('2027-01-21').getTime() - Date.now()) / 86400000)));

	const ute = $derived(
		hub.hub_pieces
			.filter((p) => p.status === 'ute')
			.sort((a, b) => (b.postad ?? b.planerad ?? '').localeCompare(a.postad ?? a.planerad ?? ''))
	);

	let kanal = $state<Stat['kanal']>('tiktok');
	let foljare = $state<number | null>(null);
	async function spara(e: SubmitEvent) {
		e.preventDefault();
		if (foljare === null) return;
		await lagg('hub_stats', { datum: iso(new Date()), kanal, foljare });
		foljare = null;
	}
	const historik = $derived([...hub.hub_stats].sort((a, b) => b.datum.localeCompare(a.datum)).slice(0, 10));
	const v = (p: Piece, k: string) => (p.siffror[k] ?? '–').toLocaleString('sv-SE');
</script>

<section class="mal">
	<p class="etikett">TikTok mot 1 000 · {dagarKvar} dagar kvar</p>
	<p class="stor rubrik">{tiktok.toLocaleString('sv-SE')}</p>
	<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax={MAL} aria-valuenow={tiktok} aria-label="Följare på TikTok">
		<span style="width: {andel}%"></span>
	</div>
	<form onsubmit={spara}>
		<select class="falt" bind:value={kanal} aria-label="Kanal">
			<option value="tiktok">TikTok</option>
			<option value="instagram">Instagram</option>
			<option value="linkedin">LinkedIn</option>
		</select>
		<input class="falt" type="number" min="0" bind:value={foljare} placeholder="Följare idag" aria-label="Följare idag" />
		<button class="knapp fylld" type="submit">Spara</button>
	</form>
	{#if historik.length}
		<p class="dampad hist">
			{#each historik as s, i (s.id)}{i ? ' · ' : ''}{kort(fran(s.datum))} {s.kanal === 'tiktok' ? 'TikTok' : s.kanal === 'instagram' ? 'Instagram' : 'LinkedIn'} {s.foljare}{/each}
		</p>
	{/if}
</section>

<section class="tabell">
	<h2 class="rubrik">Det som är ute</h2>
	<p class="dampad">Tittartid, delningar och sparningar säger mer än likes. Klicka på en rad för att fylla i.</p>
	<div class="rulla">
		<table>
			<thead>
				<tr><th>Datum</th><th>Krok</th><th>Kanal</th><th>Visn.</th><th>Förbi 3 s</th><th>Tittartid</th><th>Delade</th><th>Sparade</th><th>Komm.</th></tr>
			</thead>
			<tbody>
				{#each ute as p (p.id)}
					<tr onclick={() => oppna(p)}>
						<td class="nw">{p.postad || p.planerad ? kort(new Date((p.postad ?? p.planerad)!)) : ''}</td>
						<td><button type="button" class="lank" onclick={(e) => { e.stopPropagation(); oppna(p); }}>{p.titel}</button></td>
						<td class="nw">{p.kanaler.map((k) => namnFor(KANALER, k)).join(', ')}</td>
						<td>{v(p, 'visningar')}</td>
						<td>{v(p, 'forbi3s')}</td>
						<td>{v(p, 'tittartid')}</td>
						<td>{v(p, 'delningar')}</td>
						<td>{v(p, 'sparningar')}</td>
						<td>{v(p, 'kommentarer')}</td>
					</tr>
				{:else}
					<tr><td colspan="9" class="tom">Inget ute än.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<style>
	.mal {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.mal p {
		margin: 0;
	}
	.stor {
		font-size: clamp(64px, 14vw, 120px);
		line-height: 1;
	}
	.bar {
		height: 14px;
		background: var(--color-linje);
	}
	.bar span {
		display: block;
		height: 100%;
		background: var(--smor);
		min-width: 2px;
	}
	form {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}
	form .falt {
		flex: 1;
		min-width: 9em;
	}
	.hist {
		font-size: 14px;
	}
	.tabell {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.tabell h2 {
		font-size: 28px;
	}
	.tabell > p {
		margin: 0;
	}
	.rulla {
		overflow-x: auto;
		border-top: 2px solid var(--color-svart);
	}
	table {
		border-collapse: collapse;
		width: 100%;
		min-width: 720px;
		font-size: 15px;
		font-variant-numeric: tabular-nums;
	}
	th,
	td {
		text-align: left;
		padding: 8px 10px 8px 0;
		border-bottom: 1px solid var(--color-linje);
		vertical-align: top;
	}
	th {
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-grafit);
	}
	tbody tr {
		cursor: pointer;
	}
	tbody tr:hover {
		background: var(--kort);
	}
	.nw {
		white-space: nowrap;
	}
	.lank {
		all: unset;
		cursor: pointer;
		font-weight: 600;
	}
	.lank:focus-visible {
		outline: 2px solid var(--color-oxblod);
	}
</style>
