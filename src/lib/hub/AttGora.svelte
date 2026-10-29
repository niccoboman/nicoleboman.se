<script lang="ts">
	import type { Piece } from './types';
	import { pelarFarg, hjalp } from './types';
	import { hub, lagg, andra } from './store.svelte';
	import { iso, mandag, plusDagar, dagnamn, kort, fran } from './datum';

	let { oppna }: { oppna: (p: Piece) => void } = $props();

	const vecka = mandag(new Date());
	const idag = iso(new Date());

	// Från pipelinen: allt som ska ut inom två veckor och väntar på dig, i datumordning
	const VERB: Record<string, string> = { ide: 'Filma', filmad: 'Klipp', klippt: 'Schemalägg' };
	const grans = iso(plusDagar(new Date(), 14));
	const innehall = $derived(
		hub.hub_pieces
			.filter((p) => p.planerad && p.planerad.slice(0, 10) <= grans && VERB[p.status])
			.sort((a, b) => a.planerad!.localeCompare(b.planerad!))
	);
	const verb = (p: Piece) => (p.typ === 'inlagg' && p.status === 'ide' ? 'Skriv' : VERB[p.status]);

	// Egna punkter för veckan
	const todos = $derived(hub.hub_todos.filter((t) => t.vecka === iso(vecka)).sort((a, b) => a.sort - b.sort));
	const kvar = $derived(todos.filter((t) => !t.klar));
	const klara = $derived(todos.filter((t) => t.klar));

	let ny = $state('');
	async function laggTill(e: SubmitEvent) {
		e.preventDefault();
		if (!ny.trim()) return;
		await lagg('hub_todos', { vecka: iso(vecka), dag: '', text: ny.trim(), klar: false, sort: todos.length });
		ny = '';
	}

	let kopierad = $state('');
	async function kopiera(id: string, text: string) {
		await navigator.clipboard.writeText(text);
		kopierad = id;
		setTimeout(() => (kopierad = ''), 1500);
	}
</script>

<h1 class="serif">Att <em>göra</em></h1>

<section class="del" aria-labelledby="innehall">
	<h2 id="innehall" class="serif">Med innehållet <span>de närmaste två veckorna</span></h2>
	<ul class="lista">
		{#each innehall as p (p.id)}
			{@const d = fran(p.planerad!)}
			{@const h = hjalp(p)}
			<li style:--pf={pelarFarg(p.pelare)}>
				<span class="verb">{verb(p)}</span>
				<div>
					<button type="button" class="titel" onclick={() => oppna(p)}>{p.titel}</button>
					<p class="nar" class:sen={p.planerad!.slice(0, 10) < idag}>Ska ut {dagnamn(d)} {kort(d)}</p>
				</div>
				{#if h}
					<button type="button" class="prompt" title={h.tips} onclick={() => kopiera(p.id, h.prompt)}>
						{kopierad === p.id ? 'Kopierad' : 'Kopiera prompt'}
					</button>
				{/if}
			</li>
		{:else}
			<li class="tom">Inget väntar på dig. Njut.</li>
		{/each}
	</ul>
</section>

<section class="del" aria-labelledby="egna">
	<h2 id="egna" class="serif">Mina egna <span>den här veckan</span></h2>
	<ul class="todo">
		{#each kvar as t (t.id)}
			<li>
				<label>
					<input type="checkbox" checked={t.klar} onchange={(e) => andra('hub_todos', t.id, { klar: e.currentTarget.checked })} />
					<span>{t.text}{#if t.dag}<small> · {t.dag.toLowerCase()}</small>{/if}</span>
				</label>
			</li>
		{/each}
	</ul>
	<form onsubmit={laggTill}>
		<input bind:value={ny} placeholder="+ Lägg till" aria-label="Lägg till något att göra" />
	</form>
	{#if klara.length}
		<details>
			<summary>{klara.length} klara</summary>
			<ul class="todo klara">
				{#each klara as t (t.id)}
					<li>
						<label>
							<input type="checkbox" checked={t.klar} onchange={(e) => andra('hub_todos', t.id, { klar: e.currentTarget.checked })} />
							<span>{t.text}</span>
						</label>
					</li>
				{/each}
			</ul>
		</details>
	{/if}
</section>

<style>
	h1 {
		font-size: clamp(52px, 9vw, 96px);
		line-height: 0.95;
	}
	.del {
		display: flex;
		flex-direction: column;
		gap: 12px;
		max-width: 720px;
	}
	h2 {
		font-size: 38px;
		padding-bottom: 8px;
		border-bottom: 1px solid var(--color-svart);
	}
	h2 span {
		font-family: var(--font-arkiv);
		font-size: 15px;
		color: var(--color-grafit);
		margin-left: 8px;
	}
	.lista {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.lista li {
		display: grid;
		grid-template-columns: 7.5em minmax(0, 1fr) auto;
		gap: 4px 16px;
		align-items: center;
		padding: 14px 16px;
		background: var(--kort);
		border-left: 5px solid var(--pf);
	}
	.verb {
		font-family: 'Instrument Serif', Georgia, serif;
		font-style: italic;
		font-size: 26px;
		color: var(--pf);
	}
	.titel {
		all: unset;
		cursor: pointer;
		font-size: 18px;
		font-weight: 600;
		line-height: 1.3;
	}
	.titel:hover {
		text-decoration: underline;
	}
	.titel:focus-visible {
		outline: 2px solid var(--color-oxblod);
	}
	.nar {
		margin: 2px 0 0;
		font-size: 15px;
		color: var(--color-grafit);
	}
	.nar.sen {
		color: var(--color-oxblod);
	}
	.prompt {
		background: var(--accent);
		border: 0;
		padding: 8px 12px;
		font-size: 14px;
		font-weight: 700;
		cursor: pointer;
		white-space: nowrap;
	}
	.tom {
		display: block !important;
		font-family: 'Instrument Serif', Georgia, serif;
		font-style: italic;
		font-size: 22px;
		color: var(--color-grafit);
		background: none !important;
		border: 0 !important;
		padding: 0 !important;
	}
	.todo {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.todo label {
		display: grid;
		grid-template-columns: 34px minmax(0, 1fr);
		gap: 8px;
		padding: 10px 0;
		cursor: pointer;
		font-size: 19px;
		line-height: 1.35;
	}
	.todo input {
		width: 24px;
		height: 24px;
		margin: 0;
		accent-color: var(--color-oxblod);
		cursor: pointer;
	}
	.todo small {
		color: var(--color-grafit);
		font-size: 15px;
	}
	.klara {
		opacity: 0.6;
	}
	.klara span {
		text-decoration: line-through;
	}
	details summary {
		cursor: pointer;
		color: var(--color-grafit);
		font-size: 15px;
	}
	form input {
		width: 100%;
		background: none;
		border: 0;
		border-bottom: 1px solid var(--color-linje);
		padding: 10px 0;
		font-size: 18px;
	}
	form input:focus-visible {
		outline: none;
		border-bottom-color: var(--color-svart);
	}
	@media (max-width: 560px) {
		.lista li {
			grid-template-columns: minmax(0, 1fr) auto;
		}
		.verb {
			grid-column: 1 / -1;
		}
	}
</style>
