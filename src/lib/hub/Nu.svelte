<script lang="ts">
	import type { Piece } from './types';
	import { MAL, MANIFEST, PELARE, namnFor, nastaSteg, pelarFarg, plattform } from './types';
	import { hub, stega } from './store.svelte';
	import { iso, fran, mandag, plusDagar, kort, dagnamn, iVeckan, tidpunkt } from './datum';

	let { oppna, tillIdeer, tillAttGora }: { oppna: (p: Piece) => void; tillIdeer: () => void; tillAttGora: () => void } = $props();

	const DAGAR = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'];
	const MANADER = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
	const nu = new Date();
	const vecka = mandag(nu);
	const datumrad = `${DAGAR[nu.getDay()]} ${nu.getDate()} ${MANADER[nu.getMonth()]}`;

	// Nästa sak som ska ut
	const nasta = $derived(
		hub.hub_pieces
			.filter((p) => p.status !== 'ute' && p.planerad && new Date(p.planerad).getTime() > Date.now() - 3600_000)
			.sort((a, b) => a.planerad!.localeCompare(b.planerad!))[0]
	);
	const steg = $derived(nasta ? nastaSteg(nasta) : undefined);

	const filmer = $derived(hub.hub_pieces.filter((p) => p.typ === 'film'));
	const ute = $derived(filmer.filter((p) => p.status === 'ute').length);
	const paVag = $derived(filmer.filter((p) => p.status !== 'ute' && p.planerad).length);
	const dagarKvar = Math.max(0, Math.ceil((fran(MAL.datum).getTime() - Date.now()) / 86400000));

	// Hur mycket som väntar i Att göra: egna punkter kvar + innehåll som ska ut inom två veckor och väntar på ett steg
	const grans = iso(plusDagar(nu, 14));
	const attGora = $derived(
		hub.hub_todos.filter((t) => t.vecka === iso(vecka) && !t.klar).length +
			hub.hub_pieces.filter((p) => p.planerad && p.planerad.slice(0, 10) <= grans && ['ide', 'filmad', 'klippt'].includes(p.status)).length
	);

	const veckan = $derived(
		hub.hub_events.filter((e) => iVeckan(vecka, e.datum, e.slut) && e.typ !== 'kontroll').sort((a, b) => a.datum.localeCompare(b.datum))
	);
	const ledig = $derived(veckan.some((e) => e.typ === 'ledigt'));
	const nastaVecka = $derived(
		hub.hub_events
			.filter((e) => iVeckan(plusDagar(vecka, 7), e.datum, e.slut) && e.typ !== 'kontroll')
			.sort((a, b) => a.datum.localeCompare(b.datum))
			.map((e) => (e.typ === 'filmblock' ? `filmblock ${dagnamn(fran(e.datum))}` : e.titel.split(',')[0]))
			.join(', ')
	);

	const dagText = (e: { datum: string; slut: string | null }) =>
		e.slut && e.slut !== e.datum ? `${dagnamn(fran(e.datum))}–${dagnamn(fran(e.slut))}` : `${dagnamn(fran(e.datum))} ${fran(e.datum).getDate()}`;
</script>

<header class="halsning">
	<p class="datum">{datumrad}</p>
	<h1 class="serif">Hej <em>Nicole.</em></h1>
</header>

<section class="manifest" aria-label="Varför">
	{#each MANIFEST as stycke, i (i)}<p class:forsta={i === 0}>{stycke}</p>{/each}
</section>

<section class="hero" aria-labelledby="nasta" style:--pf={nasta ? pelarFarg(nasta.pelare) : 'var(--accent-linje)'}>
	<div class="hero-inner">
		{#if nasta}
			<p class="eyebrow">Nästa ut · {tidpunkt(nasta.planerad)}</p>
			<p class="vad">
				{#if nasta.pelare}<span><i style:background={pelarFarg(nasta.pelare)}></i>{namnFor(PELARE, nasta.pelare)}</span>{/if}
				<span>{plattform(nasta)}</span>
			</p>
			<h2 id="nasta" class="serif"><button type="button" onclick={() => oppna(nasta)}>{nasta.titel}</button></h2>
			{#if steg}
				<button
					type="button"
					class="hero-knapp"
					onclick={() => stega(nasta.id, steg.id, steg.namn)}
					>Markera som {steg.namn.toLowerCase()}</button
				>
			{/if}
		{:else}
			<p class="eyebrow">Nästa ut</p>
			<h2 id="nasta" class="serif">Din nästa film börjar som <em>en tanke.</em></h2>
			<button type="button" class="hero-knapp" onclick={tillIdeer}>Fånga en tanke</button>
		{/if}
	</div>
</section>

<p class="mal">
	<b>{ute} ute</b> · {paVag} på väg · {dagarKvar} dagar till {kort(fran(MAL.datum))}
</p>

<section class="block" aria-labelledby="gora">
	<h2 id="gora" class="serif liten">Den här <em>veckan</em></h2>

	{#if veckan.length}
		<ul class="handelser">
			{#each veckan as e (e.id)}
				<li class:film={e.typ === 'filmblock'}><span class="dag">{dagText(e)}</span>{e.typ === 'filmblock' ? `Filmblock${e.anteckning ? ` · ${e.anteckning}` : ''}` : e.titel}</li>
			{/each}
		</ul>
	{/if}
	{#if ledig}<p class="mjuk">Ledigt. Vila räknas också.</p>{/if}

	<button type="button" class="till-gora" onclick={tillAttGora}>
		{attGora ? `${attGora} saker att göra` : 'Inget att göra just nu'} <span>→</span>
	</button>
</section>

{#if nastaVecka}
	<p class="framat"><span>Nästa vecka</span> {nastaVecka}</p>
{/if}

<section class="pelarna" aria-labelledby="pelarna">
	<h2 id="pelarna" class="serif liten">Mina fyra <em>pelare</em></h2>
	<dl>
		{#each PELARE as pe (pe.id)}
			<div style:--pf={pelarFarg(pe.id)}>
				<dt>{pe.namn}</dt>
				<dd>{pe.om}</dd>
			</div>
		{/each}
	</dl>
</section>

<style>
	.halsning {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.datum {
		margin: 0;
		color: var(--color-grafit);
		font-size: 16px;
	}
	.datum::first-letter {
		text-transform: uppercase;
	}
	.halsning h1 {
		font-size: clamp(52px, 9vw, 96px);
		line-height: 0.95;
	}

	/* Nästa ut: ett ljust kort med pelarens färg överst */
	.hero {
		background: var(--kort);
		border-top: 6px solid var(--pf);
		box-shadow: 0 1px 0 var(--color-linje);
	}
	.hero-inner {
		padding: 32px clamp(20px, 4vw, 40px);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
	}
	.eyebrow {
		margin: 0;
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-grafit);
	}
	.vad {
		margin: -8px 0 0;
		display: flex;
		gap: 16px;
		font-size: 15px;
		font-weight: 600;
	}
	.vad i {
		display: inline-block;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		margin-right: 7px;
	}
	.hero h2 {
		font-size: clamp(46px, 8vw, 96px);
		line-height: 0.98;
		max-width: 14ch;
	}
	.hero h2 button {
		all: unset;
		cursor: pointer;
	}
	.hero h2 button:focus-visible {
		outline: 2px solid var(--color-oxblod);
		outline-offset: 4px;
	}
	.hero-knapp {
		background: var(--accent);
		color: #17150f;
		border: 0;
		padding: 12px 20px;
		min-height: 48px;
		font-weight: 700;
		font-size: 16px;
		cursor: pointer;
	}
	.hero-knapp:hover {
		background: var(--color-svart);
		color: var(--color-krita);
	}
	.manifest {
		max-width: 620px;
		margin-top: -16px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.manifest p {
		margin: 0;
		font-size: 18px;
		line-height: 1.55;
		color: var(--color-grafit);
	}
	.manifest .forsta {
		font-family: 'Instrument Serif', Georgia, serif;
		font-size: 28px;
		line-height: 1.2;
		color: var(--color-svart);
	}
	.pelarna {
		display: flex;
		flex-direction: column;
		gap: 16px;
		max-width: 760px;
	}
	.pelarna dl {
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 14px;
	}
	.pelarna div {
		padding: 14px 16px;
		background: var(--kort);
		border-left: 5px solid var(--pf);
	}
	.pelarna dt {
		font-family: 'Instrument Serif', Georgia, serif;
		font-size: 26px;
		line-height: 1.1;
	}
	.pelarna dd {
		margin: 4px 0 0;
		font-size: 16px;
		color: var(--color-grafit);
	}

	.mal {
		margin: -12px 0 0;
		font-size: 19px;
		color: var(--color-grafit);
	}
	.mal b {
		color: var(--color-svart);
	}

	.block {
		display: flex;
		flex-direction: column;
		gap: 14px;
		max-width: 640px;
	}
	.liten {
		font-size: 44px;
		padding-bottom: 8px;
		border-bottom: 1px solid var(--color-svart);
	}
	.handelser {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 18px;
		color: var(--color-grafit);
	}
	.handelser li {
		display: grid;
		grid-template-columns: 5.2em minmax(0, 1fr);
		gap: 10px;
	}
	.handelser li.film {
		color: var(--color-svart);
		font-weight: 700;
	}
	.dag {
		font-size: 14px;
		font-weight: 700;
		padding-top: 2px;
	}
	.dag::first-letter {
		text-transform: uppercase;
	}
	.till-gora {
		align-self: flex-start;
		background: var(--accent);
		border: 0;
		padding: 12px 18px;
		font-size: 18px;
		font-weight: 700;
		cursor: pointer;
	}
	.till-gora span {
		color: var(--color-oxblod);
	}
	.till-gora:hover {
		background: var(--color-svart);
		color: var(--color-krita);
	}
	.mjuk {
		margin: 0;
		color: var(--color-grafit);
		font-size: 15px;
	}
	.framat {
		margin: 0;
		color: var(--color-grafit);
		font-size: 15px;
		max-width: 640px;
	}
	.framat span {
		font-weight: 700;
		color: var(--color-svart);
		margin-right: 6px;
	}
</style>
