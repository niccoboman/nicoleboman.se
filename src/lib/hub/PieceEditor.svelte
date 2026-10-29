<script lang="ts">
	import type { Piece } from './types';
	import { STATUS, PELARE, FORMAT } from './types';
	import { andra, tabort } from './store.svelte';

	let { piece, stang }: { piece: Piece | null; stang: () => void } = $props();

	let dialog = $state<HTMLDialogElement>();
	let utkast = $state<Piece | null>(null);
	let sakerRadera = $state(false);

	$effect(() => {
		if (piece && dialog) {
			utkast = { ...piece };
			sakerRadera = false;
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

	async function spara(e: SubmitEvent) {
		e.preventDefault();
		if (!utkast) return;
		const { id, created_at, ...resten } = utkast;
		resten.typ = resten.format === 'text' ? 'inlagg' : 'film';
		if (resten.status === 'inkorg' && resten.pelare) resten.status = 'ide';
		if (resten.status === 'ute' && !resten.postad) resten.postad = resten.planerad ?? new Date().toISOString();
		await andra('hub_pieces', id, resten);
		stang();
	}

	async function radera() {
		if (!utkast) return;
		if (!sakerRadera) return (sakerRadera = true);
		await tabort('hub_pieces', utkast.id);
		stang();
	}
</script>

<dialog bind:this={dialog} onclose={stang} aria-labelledby="redigera-rubrik">
	{#if utkast}
		<form onsubmit={spara}>
			<div class="topp">
				<span id="redigera-rubrik" class="etikett">{utkast.typ === 'film' ? 'Film' : 'LinkedIn-inlägg'}</span>
				<button type="button" class="stang" onclick={stang} aria-label="Stäng">×</button>
			</div>

			<label class="krok">
				<span class="sr-only">Krok</span>
				<textarea class="rubrik" rows="2" bind:value={utkast.titel} required maxlength="300"></textarea>
			</label>

			<div class="rad">
				<label>
					<span class="etikett">Status</span>
					<select class="falt" bind:value={utkast.status}>
						{#each STATUS as s (s.id)}<option value={s.id}>{s.namn}</option>{/each}
					</select>
				</label>
				<label>
					<span class="etikett">Går ut</span>
					<input
						class="falt"
						type="datetime-local"
						value={tillLokal(utkast.planerad)}
						onchange={(e) => utkast && (utkast.planerad = e.currentTarget.value ? new Date(e.currentTarget.value).toISOString() : null)}
					/>
				</label>
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

			<label>
				<span class="etikett">{utkast.typ === 'film' ? 'Stödord och caption' : 'Inlägget'}</span>
				<textarea class="falt" rows="6" bind:value={utkast.text}></textarea>
			</label>

			<label>
				<span class="etikett">Anteckning</span>
				<textarea class="falt" rows="2" bind:value={utkast.anteckning}></textarea>
			</label>

			{#if utkast.fil}<p class="fil dampad">Fil: <code>{utkast.fil}</code></p>{/if}

			<div class="botten">
				<button type="button" class="radera" onclick={radera}>{sakerRadera ? 'Säker? Klicka igen' : 'Ta bort'}</button>
				<button type="submit" class="knapp fylld">Spara</button>
			</div>
		</form>
	{/if}
</dialog>

<style>
	dialog {
		margin: auto;
		width: min(620px, calc(100vw - 24px));
		max-height: calc(100dvh - 24px);
		padding: 0;
		border: 0;
		background: var(--color-krita);
		color: var(--color-svart);
		box-shadow: 0 24px 80px rgb(0 0 0 / 0.4);
	}
	dialog::backdrop {
		background: rgb(0 0 0 / 0.55);
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 20px 22px 22px;
		border-top: 6px solid var(--accent);
	}
	.topp,
	.botten {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.stang {
		background: none;
		border: 0;
		font-size: 28px;
		line-height: 1;
		min-width: 40px;
		min-height: 40px;
		cursor: pointer;
	}
	.krok textarea {
		width: 100%;
		border: 0;
		border-bottom: 1px solid var(--color-linje);
		background: none;
		font-size: clamp(26px, 5vw, 34px);
		resize: none;
		padding: 0 0 6px;
	}
	.krok textarea:focus-visible {
		outline: none;
		border-bottom-color: var(--color-svart);
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
	.fil {
		margin: 0;
		font-size: 14px;
		overflow-wrap: anywhere;
	}
	.radera {
		background: none;
		border: 0;
		color: var(--color-grafit);
		cursor: pointer;
		font-size: 14px;
		padding: 8px 0;
	}
	@media (max-width: 520px) {
		.rad {
			grid-template-columns: 1fr;
		}
	}
</style>
