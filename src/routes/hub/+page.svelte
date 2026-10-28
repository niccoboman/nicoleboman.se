<script lang="ts">
	import '$lib/hub/hub.css';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import type { Session } from '@supabase/supabase-js';
	import { supabase } from '$lib/hub/supabase';
	import { hub, ladda, angra } from '$lib/hub/store.svelte';
	import type { Piece } from '$lib/hub/types';
	import Nu from '$lib/hub/Nu.svelte';
	import Ideer from '$lib/hub/Ideer.svelte';
	import Pipeline from '$lib/hub/Pipeline.svelte';
	import PieceEditor from '$lib/hub/PieceEditor.svelte';

	const VYER = [
		{ id: 'nu', namn: 'Nu' },
		{ id: 'ideer', namn: 'Idéer' },
		{ id: 'pipeline', namn: 'Pipeline' }
	] as const;
	type Vy = (typeof VYER)[number]['id'];

	let vy = $state<Vy>('nu');
	let session = $state<Session | null>(null);
	let kollad = $state(false);
	let epost = $state('');
	let skickat = $state(false);
	let loginFel = $state('');
	let oppen = $state<Piece | null>(null);

	function franHash(): Vy {
		const h = location.hash.slice(1);
		return (VYER.find((v) => v.id === h)?.id ?? 'nu') as Vy;
	}
	function byt(v: Vy) {
		vy = v;
		history.replaceState(null, '', `#${v}`);
		window.scrollTo({ top: 0 });
	}

	onMount(() => {
		vy = franHash();
		const hashByte = () => (vy = franHash());
		window.addEventListener('hashchange', hashByte);
		const preview = dev && new URLSearchParams(location.search).get('preview') === '1';
		if (preview) {
			kollad = true;
			ladda(true);
			return () => window.removeEventListener('hashchange', hashByte);
		}
		if (!supabase) {
			kollad = true;
			return () => window.removeEventListener('hashchange', hashByte);
		}
		supabase.auth.getSession().then(({ data }) => {
			session = data.session;
			kollad = true;
			if (session) ladda(false);
		});
		const { data } = supabase.auth.onAuthStateChange((_e, ny) => {
			const forst = !session && ny;
			session = ny;
			if (forst) ladda(false);
		});
		return () => {
			data.subscription.unsubscribe();
			window.removeEventListener('hashchange', hashByte);
		};
	});

	async function loggaIn(e: SubmitEvent) {
		e.preventDefault();
		if (!supabase) return;
		loginFel = '';
		const { error } = await supabase.auth.signInWithOtp({
			email: epost.trim(),
			options: { shouldCreateUser: false, emailRedirectTo: `${location.origin}/hub` }
		});
		if (error) loginFel = 'Det gick inte. Kolla adressen och försök igen.';
		else skickat = true;
	}

	async function loggaUt() {
		await supabase?.auth.signOut();
		session = null;
		hub.ready = false;
	}

	const inloggad = $derived(hub.preview || !!session);
	const inkorg = $derived(hub.hub_pieces.filter((p) => p.status === 'inkorg').length);
</script>

<svelte:head>
	<title>Hubben</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="hub">
	{#if !kollad}
		<p class="vanta">…</p>
	{:else if !inloggad}
		<main class="login">
			<h1 class="rubrik">Hubben</h1>
			{#if !supabase}
				<p>Supabase är inte inställt i den här miljön.</p>
			{:else if skickat}
				<p>Kolla mejlen. Länken loggar in dig här.</p>
			{:else}
				<form onsubmit={loggaIn}>
					<label for="epost" class="etikett">E-post</label>
					<input id="epost" class="falt" type="email" autocomplete="email" required bind:value={epost} />
					<button class="knapp fylld" type="submit">Skicka inloggningslänk</button>
					{#if loginFel}<p role="alert">{loginFel}</p>{/if}
				</form>
			{/if}
		</main>
	{:else}
		<header>
			<a href="/hub#nu" class="logo rubrik" onclick={(e) => { e.preventDefault(); byt('nu'); }}>Hubben</a>
			<nav aria-label="Vyer">
				{#each VYER as v (v.id)}
					<button type="button" class:aktiv={vy === v.id} aria-current={vy === v.id ? 'page' : undefined} onclick={() => byt(v.id)}>
						{v.namn}{#if v.id === 'ideer' && inkorg}<span class="bricka">{inkorg}</span>{/if}
					</button>
				{/each}
			</nav>
			{#if hub.preview}
				<span class="chip smor">Förhandsläge</span>
			{:else}
				<button type="button" class="ut" onclick={loggaUt}>Logga ut</button>
			{/if}
		</header>

		{#if hub.error}<p class="fel" role="alert">{hub.error}</p>{/if}

		<main class="vy">
			{#if !hub.ready}
				<p class="tom">Laddar…</p>
			{:else if vy === 'nu'}
				<Nu oppna={(p) => (oppen = p)} tillIdeer={() => byt('ideer')} />
			{:else if vy === 'ideer'}
				<Ideer oppna={(p) => (oppen = p)} />
			{:else}
				<Pipeline oppna={(p) => (oppen = p)} />
			{/if}
		</main>

		<PieceEditor piece={oppen} stang={() => (oppen = null)} />

		<div class="angra" aria-live="polite">
			{#if angra.gor}
				<span>{angra.text}</span>
				<button type="button" onclick={() => angra.gor?.()}>Ångra</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.vanta {
		padding: 40px;
	}
	.login {
		max-width: 420px;
		margin: 0 auto;
		padding: 18vh 16px 40px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.login h1 {
		font-size: 56px;
	}
	.login form {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	header {
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 10px max(16px, env(safe-area-inset-left));
		background: var(--color-krita);
	}
	.logo {
		font-size: 24px;
		color: inherit;
		text-decoration: none;
	}
	nav {
		display: flex;
		gap: 2px;
		overflow-x: auto;
		flex: 1;
		scrollbar-width: none;
	}
	nav button {
		background: none;
		border: 0;
		padding: 8px 12px;
		min-height: 40px;
		cursor: pointer;
		font-weight: 600;
		white-space: nowrap;
		color: var(--color-grafit);
	}
	nav button:hover {
		color: var(--color-svart);
	}
	nav button.aktiv {
		color: var(--color-svart);
		box-shadow: inset 0 -3px 0 var(--color-svart);
	}
	.bricka {
		display: inline-block;
		margin-left: 6px;
		min-width: 20px;
		padding: 0 5px;
		background: var(--smor);
		color: var(--smor-text);
		font-size: 12px;
		font-weight: 800;
		text-align: center;
	}
	.ut {
		background: none;
		border: 0;
		cursor: pointer;
		color: var(--color-grafit);
		font-size: 14px;
		white-space: nowrap;
	}
	.fel {
		margin: 12px 16px 0;
		padding: 10px 12px;
		border: 1px solid var(--color-oxblod);
	}
	.vy {
		max-width: 880px;
		margin: 0 auto;
		padding: 32px max(16px, env(safe-area-inset-left)) 96px;
		display: flex;
		flex-direction: column;
		gap: 40px;
	}
	.angra {
		position: fixed;
		left: 50%;
		bottom: max(20px, env(safe-area-inset-bottom));
		transform: translateX(-50%);
		z-index: 20;
	}
	.angra:not(:empty) {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 12px 18px;
		background: #17150f;
		color: #f6f3ea;
		box-shadow: 0 10px 40px rgb(0 0 0 / 0.35);
		white-space: nowrap;
	}
	.angra button {
		background: var(--smor);
		color: #17150f;
		border: 0;
		padding: 6px 14px;
		min-height: 36px;
		font-weight: 700;
		cursor: pointer;
	}
	@media (max-width: 640px) {
		header {
			flex-wrap: wrap;
			gap: 4px 12px;
		}
		nav {
			order: 3;
			flex-basis: 100%;
		}
	}
</style>
