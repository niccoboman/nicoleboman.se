<script lang="ts">
	import type { Piece, Kanal } from './types';
	import { STATUS, PELARE, FORMAT, KANALER, SIFFROR } from './types';
	import { andra, tabort } from './store.svelte';

	let { piece, stang }: { piece: Piece | null; stang: () => void } = $props();

	let dialog = $state<HTMLDialogElement>();
	let utkast = $state<Piece | null>(null);

	$effect(() => {
		if (piece && dialog) {
			utkast = JSON.parse(JSON.stringify(piece));
			if (!dialog.open) dialog.showModal();
		} else if (!piece && dialog?.open) dialog.close();
	});

	// datetime-local vill ha "ÅÅÅÅ-MM-DDTHH:MM" i lokal tid
	function tillLokal(s: string | null) {
		if (!s) return '';
		const d = new Date(s);
		const p = (n: number) => String(n).padStart(2, '0');
		return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
	}
	const franLokal = (s: string) => (s ? new Date(s).toISOString() : null);

	function vaxlaKanal(k: Kanal) {
		if (!utkast) return;
		utkast.kanaler = utkast.kanaler.includes(k) ? utkast.kanaler.filter((x) => x !== k) : [...utkast.kanaler, k];
	}

	function satSiffra(id: string, v: string) {
		if (!utkast) return;
		const s = { ...utkast.siffror };
		if (v === '') delete s[id];
		else s[id] = Number(v);
		utkast.siffror = s;
	}

	async function spara() {
		if (!utkast || !piece) return;
		const { id, created_at, ...resten } = utkast;
		if (resten.status === 'ute' && !resten.postad) resten.postad = resten.planerad ?? new Date().toISOString();
		await andra('hub_pieces', id, resten);
		stang();
	}

	async function radera() {
		if (!piece) return;
		if (!confirmRadera) {
			confirmRadera = true;
			return;
		}
		await tabort('hub_pieces', piece.id);
		confirmRadera = false;
		stang();
	}
	let confirmRadera = $state(false);
</script>

<dialog bind:this={dialog} onclose={() => { confirmRadera = false; stang(); }} aria-labelledby="redigera-rubrik">
	{#if utkast}
		<form method="dialog" onsubmit={(e) => { e.preventDefault(); spara(); }}>
			<div class="topp">
				<h2 id="redigera-rubrik" class="rubrik">{utkast.typ === 'film' ? 'Film' : 'Inlägg'}</h2>
				<button type="button" class="knapp liten" onclick={stang}>Stäng</button>
			</div>

			<label>
				<span class="etikett">Krok / rubrik</span>
				<input class="falt" bind:value={utkast.titel} required maxlength="300" />
			</label>

			<div class="rad">
				<label>
					<span class="etikett">Status</span>
					<select class="falt" bind:value={utkast.status}>
						{#each STATUS as s (s.id)}<option value={s.id}>{s.namn}</option>{/each}
					</select>
				</label>
				<label>
					<span class="etikett">Typ</span>
					<select class="falt" bind:value={utkast.typ}>
						<option value="film">Film</option>
						<option value="inlagg">Inlägg</option>
					</select>
				</label>
			</div>

			<div class="rad">
				<label>
					<span class="etikett">Pelare</span>
					<select class="falt" bind:value={utkast.pelare}>
						<option value={null}>–</option>
						{#each PELARE as p (p.id)}<option value={p.id}>{p.namn}</option>{/each}
					</select>
				</label>
				<label>
					<span class="etikett">Format</span>
					<select class="falt" bind:value={utkast.format}>
						<option value={null}>–</option>
						{#each FORMAT as f (f.id)}<option value={f.id}>{f.namn}</option>{/each}
					</select>
				</label>
			</div>

			<fieldset>
				<legend class="etikett">Kanaler</legend>
				<div class="kanaler">
					{#each KANALER as k (k.id)}
						<label class="kryss"><input type="checkbox" checked={utkast.kanaler.includes(k.id)} onchange={() => vaxlaKanal(k.id)} /> {k.namn}</label>
					{/each}
				</div>
			</fieldset>

			<label>
				<span class="etikett">Går ut</span>
				<input
					class="falt"
					type="datetime-local"
					value={tillLokal(utkast.planerad)}
					onchange={(e) => utkast && (utkast.planerad = franLokal(e.currentTarget.value))}
				/>
			</label>

			<label>
				<span class="etikett">{utkast.typ === 'film' ? 'Caption och stödord' : 'Inlägget'}</span>
				<textarea class="falt" rows="6" bind:value={utkast.text}></textarea>
			</label>

			<label>
				<span class="etikett">Anteckning</span>
				<textarea class="falt" rows="2" bind:value={utkast.anteckning}></textarea>
			</label>

			<label>
				<span class="etikett">Fil</span>
				<input class="falt" bind:value={utkast.fil} placeholder="~/Desktop/…_v1.mp4" />
			</label>

			{#if utkast.status === 'ute' || utkast.status === 'schemalagd'}
				<fieldset>
					<legend class="etikett">Siffror</legend>
					<div class="siffror">
						{#each SIFFROR as s (s.id)}
							<label>
								<span>{s.namn}</span>
								<input
									class="falt"
									type="number"
									min="0"
									step="any"
									value={utkast.siffror[s.id] ?? ''}
									oninput={(e) => satSiffra(s.id, e.currentTarget.value)}
								/>
							</label>
						{/each}
					</div>
				</fieldset>
			{/if}

			<div class="botten">
				<button type="button" class="knapp liten" onclick={radera}>{confirmRadera ? 'Säker? Klicka igen' : 'Ta bort'}</button>
				<button type="submit" class="knapp fylld">Spara</button>
			</div>
		</form>
	{/if}
</dialog>

<style>
	dialog {
		margin: auto;
		width: min(640px, calc(100vw - 24px));
		max-height: calc(100dvh - 24px);
		padding: 0;
		border: 1px solid var(--color-svart);
		background: var(--color-krita);
		color: var(--color-svart);
	}
	dialog::backdrop {
		background: rgb(0 0 0 / 0.5);
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 20px;
	}
	.topp,
	.botten {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}
	h2 {
		font-size: 28px;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.rad {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}
	fieldset {
		border: 0;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.kanaler {
		display: flex;
		gap: 18px;
		flex-wrap: wrap;
	}
	.kryss {
		flex-direction: row;
		align-items: center;
		gap: 6px;
	}
	.kryss input {
		width: 20px;
		height: 20px;
	}
	.siffror {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 10px;
		font-size: 14px;
	}
	@media (max-width: 520px) {
		.rad {
			grid-template-columns: 1fr;
		}
	}
</style>
