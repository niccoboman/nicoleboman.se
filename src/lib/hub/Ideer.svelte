<script lang="ts">
	import type { Piece, Pelare } from './types';
	import { PELARE, pelarFarg, plattform } from './types';
	import { hub, lagg } from './store.svelte';

	let { oppna }: { oppna: (p: Piece) => void } = $props();

	// Idéer = inkorg + idéer utan tid. Med en tid hamnar de i Pipeline.
	const ideer = $derived(hub.hub_pieces.filter((p) => p.status === 'inkorg' || (p.status === 'ide' && !p.planerad)));
	const inkorg = $derived(ideer.filter((p) => p.status === 'inkorg' || !p.pelare));
	const antal = (id: Pelare) => ideer.filter((p) => p.status === 'ide' && p.pelare === id).length;

	// En pelare i taget
	let vald = $state<Pelare | 'inkorg'>('omdome');
	const lista = $derived(vald === 'inkorg' ? inkorg : ideer.filter((p) => p.status === 'ide' && p.pelare === vald));

	let tanke = $state('');
	let falt: HTMLTextAreaElement;

	// En inspirationsfråga blir början på en ny tanke
	function borja(fraga: string) {
		tanke = `${fraga}\n`;
		falt.focus();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
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
		setTimeout(() => (sparad = false), 2000);
	}
</script>

<form class="fanga" onsubmit={fanga}>
	<label for="tanke" class="serif">Vad väcker ett <em>ja</em> i dig idag?</label>
	<textarea
		id="tanke"
		rows="3"
		bind:value={tanke}
		bind:this={falt}
		placeholder="Säg det som du skulle säga det i kameran."
		onkeydown={(e) => (e.metaKey || e.ctrlKey) && e.key === 'Enter' && e.currentTarget.form?.requestSubmit()}
	></textarea>
	<div class="rad">
		<span aria-live="polite">{sparad ? 'Sparad. Claude sorterar den.' : ''}</span>
		<button type="submit">Spara</button>
	</div>
</form>

<div class="flikar" role="group" aria-label="Visa pelare">
	{#if inkorg.length}
		<button type="button" aria-pressed={vald === 'inkorg'} class:aktiv={vald === 'inkorg'} onclick={() => (vald = 'inkorg')}>Inkorg <span>{inkorg.length}</span></button>
	{/if}
	{#each PELARE as p (p.id)}
		<button type="button" aria-pressed={vald === p.id} class:aktiv={vald === p.id} onclick={() => (vald = p.id)}><i class="prick" style:background={pelarFarg(p.id)}></i>{p.namn} <span>{antal(p.id)}</span></button>
	{/each}
</div>

{#if vald !== 'inkorg'}
	{@const pe = PELARE.find((x) => x.id === vald)!}
	<div class="inspo" style:--pf={pelarFarg(pe.id)}>
		<p class="om">{pe.om}</p>
		<p class="etikett">Inspo – tryck för att börja</p>
		<ul>
			{#each pe.fragor as f (f)}<li><button type="button" onclick={() => borja(f)}>{f}</button></li>{/each}
		</ul>
	</div>
{/if}

<ul class="lista">
	{#each lista as p (p.id)}
		<li style:--pf={pelarFarg(p.pelare)}><button type="button" onclick={() => oppna(p)}>{p.titel}<small>{plattform(p)}</small></button></li>
	{:else}
		<li class="tom">Inget här än.</li>
	{/each}
</ul>

<style>
	.fanga {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: clamp(20px, 4vw, 36px);
		background: var(--accent);
		color: #17150f;
	}
	.fanga label {
		font-size: clamp(40px, 6vw, 64px);
		line-height: 1;
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
		font-size: 15px;
	}
	.fanga button {
		background: #17150f;
		color: #fff;
		border: 0;
		padding: 10px 24px;
		min-height: 44px;
		font-weight: 700;
		cursor: pointer;
	}
	.flikar {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}
	.flikar button {
		background: none;
		border: 1px solid var(--color-linje);
		padding: 8px 16px;
		min-height: 44px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		color: var(--color-grafit);
	}
	.prick {
		display: inline-block;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		margin-right: 7px;
	}
	.flikar button span {
		margin-left: 4px;
		opacity: 0.7;
	}
	.flikar button.aktiv {
		background: var(--color-svart);
		border-color: var(--color-svart);
		color: var(--color-krita);
	}
	.lista {
		list-style: none;
		margin: -12px 0 0;
		padding: 0;
		max-width: 680px;
	}
	.lista button {
		all: unset;
		box-sizing: border-box;
		display: block;
		width: 100%;
		padding: 16px 0 16px 18px;
		border-left: 5px solid var(--pf);
		font-family: 'Instrument Serif', Georgia, serif;
		font-size: 27px;
		line-height: 1.12;
		cursor: pointer;
	}
	.lista small {
		display: block;
		margin-top: 6px;
		font-family: var(--font-arkiv);
		font-size: 14px;
		font-weight: 600;
		color: var(--color-grafit);
	}
	.lista button:hover {
		text-decoration: underline;
	}
	.lista button:focus-visible {
		outline: 2px solid var(--color-oxblod);
	}
	.lista li + li {
		border-top: 1px solid var(--color-linje);
	}
	.inspo {
		margin-top: -14px;
		padding: 16px 18px;
		background: var(--kort);
		border-left: 5px solid var(--pf);
		max-width: 680px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.om {
		margin: 0;
		font-family: 'Instrument Serif', Georgia, serif;
		font-size: 24px;
		line-height: 1.2;
	}
	.inspo .etikett {
		margin: 4px 0 0;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.inspo ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.inspo button {
		background: none;
		border: 0;
		padding: 4px 0;
		text-align: left;
		font-size: 17px;
		cursor: pointer;
		color: var(--color-svart);
	}
	.inspo button::before {
		content: '→ ';
		color: var(--pf);
	}
	.inspo button:hover {
		text-decoration: underline;
	}
	.tom {
		color: var(--color-grafit);
		padding: 14px 0;
	}
</style>
