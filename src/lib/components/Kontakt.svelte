<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { text, type Sprak } from '$lib/i18n';

	let { sprak }: { sprak: Sprak } = $props();
	const f = $derived(text[sprak].formular);

	// Formuläret skickas till en formulärtjänst (t.ex. Formspree) som vidarebefordrar till Nicoles inkorg.
	// Adressen sätts i miljövariabeln PUBLIC_KONTAKT_ENDPOINT, t.ex. https://formspree.io/f/abcdwxyz
	const endpoint = env.PUBLIC_KONTAKT_ENDPOINT;

	// Ämnet skickas alltid på svenska, så att det ser likadant ut i inkorgen oavsett språk på sidan.
	const amnenSv = text.sv.formular.amnen;
	let amne = $state<string>(amnenSv[0]);
	let status = $state<'redo' | 'skickar' | 'skickat' | 'fel'>('redo');

	async function skicka(e: SubmitEvent) {
		e.preventDefault();
		const form = e.currentTarget as HTMLFormElement;
		if (!endpoint) {
			status = 'fel';
			return;
		}
		status = 'skickar';
		try {
			const svar = await fetch(endpoint, {
				method: 'POST',
				headers: { Accept: 'application/json' },
				body: new FormData(form)
			});
			status = svar.ok ? 'skickat' : 'fel';
			if (svar.ok) form.reset();
		} catch {
			status = 'fel';
		}
	}
</script>

{#if status === 'skickat'}
	<div class="border-t-2 border-krita pt-6" role="status">
		<p class="jatte text-[clamp(2.4rem,5vw,4.5rem)]">{f.tack}</p>
		<p class="mt-3 text-[1.1rem] text-krita/85">{f.tackText}</p>
	</div>
{:else}
	<form onsubmit={skicka} class="grid gap-8">
		<fieldset>
			<legend class="etikett text-krita/80">{f.detGaller}</legend>
			<div class="mt-3 flex flex-wrap gap-2">
				{#each amnenSv as a, n (a)}
					<label
						class="etikett cursor-pointer border-2 border-krita px-4 py-2.5 transition-colors has-[:checked]:bg-krita has-[:checked]:text-svart has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2"
					>
						<input type="radio" name="amne" value={a} bind:group={amne} class="sr-only" />
						{f.amnen[n]}
					</label>
				{/each}
			</div>
		</fieldset>

		<div class="grid gap-8 md:grid-cols-2">
			<label class="grid gap-2">
				<span class="etikett text-krita/80">{f.namn}</span>
				<input name="namn" required autocomplete="name" class="falt" />
			</label>
			<label class="grid gap-2">
				<span class="etikett text-krita/80">{f.epost}</span>
				<input name="email" type="email" required autocomplete="email" class="falt" />
			</label>
		</div>
		<label class="grid gap-2">
			<span class="etikett text-krita/80">{f.organisation} <span class="normal-case tracking-normal">{f.valfritt}</span></span>
			<input name="organisation" autocomplete="organization" class="falt" />
		</label>
		<label class="grid gap-2">
			<span class="etikett text-krita/80">{f.meddelande}</span>
			<textarea name="meddelande" required rows="4" class="falt resize-y"></textarea>
		</label>

		<input type="hidden" name="sprak" value={sprak} />
		<!-- Fälla för spamrobotar; syns inte för människor -->
		<input type="text" name="_gotcha" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />

		<div class="flex flex-wrap items-center gap-6">
			<button
				type="submit"
				disabled={status === 'skickar'}
				class="jatte cursor-pointer bg-krita px-8 py-4 text-[clamp(1.4rem,2.4vw,2rem)] text-svart transition-transform hover:-translate-y-0.5 disabled:opacity-60"
			>
				{status === 'skickar' ? f.skickar : f.skicka}{#if status !== 'skickar'}<span aria-hidden="true">&nbsp;→</span>{/if}
			</button>
			<p class="max-w-[38ch] text-[0.9rem] text-krita/80">
				{f.integritet}
			</p>
		</div>

		{#if status === 'fel'}
			<p class="text-[1rem] text-krita" role="alert">
				{endpoint ? f.fel : f.ejKopplat}
			</p>
		{/if}
	</form>
{/if}

<style>
	.falt {
		width: 100%;
		border: 0;
		border-bottom: 2px solid color-mix(in srgb, var(--color-krita) 65%, transparent);
		background: transparent;
		padding: 0.4rem 0;
		font-size: 1.25rem;
		color: var(--color-krita);
		border-radius: 0;
		transition: border-color 0.2s;
	}
	.falt:focus {
		outline: none;
		border-bottom-color: var(--color-krita);
	}
	/* Tydlig fokusram för den som navigerar med tangentbord */
	.falt:focus-visible {
		outline: 2px solid var(--color-krita);
		outline-offset: 4px;
	}
</style>
