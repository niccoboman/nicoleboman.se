<script lang="ts">
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import type { Session } from '@supabase/supabase-js';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
	import Check from 'phosphor-svelte/lib/Check';
	import Microphone from 'phosphor-svelte/lib/Microphone';
	import Paperclip from 'phosphor-svelte/lib/Paperclip';
	import SignOut from 'phosphor-svelte/lib/SignOut';
	import X from 'phosphor-svelte/lib/X';
	import { queueBrainCapture } from '$lib/admin/brain';
	import { supabase } from '$lib/admin/supabase';

	type AuthState = 'loading' | 'signed-out' | 'signed-in';
	type View = 'idag' | 'inbox' | 'projekt' | 'manniskor' | 'texter' | 'kunskap';
	type Capture = {
		id: string;
		text: string;
		createdAt: string;
		attachments: string[];
	};
	type AttentionItem = {
		id: number;
		title: string;
		source: string;
		detail: string;
		resolved: boolean;
	};

	const navItems: { id: View; label: string }[] = [
		{ id: 'idag', label: 'I dag' },
		{ id: 'inbox', label: 'Inbox' },
		{ id: 'projekt', label: 'Projekt' },
		{ id: 'manniskor', label: 'Människor' },
		{ id: 'texter', label: 'Texter' },
		{ id: 'kunskap', label: 'Kunskap' }
	];

	const moduleCopy: Record<Exclude<View, 'idag'>, { eyebrow: string; title: string; description: string }> = {
		inbox: {
			eyebrow: '07 fångster',
			title: 'Inbox',
			description: 'Allt som kommit in och ännu inte fått sin rätta plats.'
		},
		projekt: {
			eyebrow: '04 aktiva',
			title: 'Projekt',
			description: 'Pågående arbeten, nästa steg och sådant som väntar.'
		},
		manniskor: {
			eyebrow: 'Relationer',
			title: 'Människor',
			description: 'Samtal, löften och sammanhang du vill komma ihåg.'
		},
		texter: {
			eyebrow: '12 utkast',
			title: 'Texter',
			description: 'Idéer och utkast på väg mot webbplatsen eller LinkedIn.'
		},
		kunskap: {
			eyebrow: 'Levande minne',
			title: 'Kunskap',
			description: 'Anteckningar, samband och sådant som förändrar hur du tänker.'
		}
	};

	const schedule = [
		{ time: '09:00', title: 'Skrivtid', note: 'Fokus: nytt essäutkast', duration: '90 min', focus: true },
		{ time: '12:30', title: 'Lunch med Elin', note: 'Restaurang Celeste, Södermalm', duration: '60 min', focus: false },
		{ time: '17:00', title: 'Promenad', note: 'Djurgården runt', duration: '45 min', focus: false }
	];

	let attention = $state<AttentionItem[]>([
		{
			id: 1,
			title: 'Granska och publicera LinkedIn-utkast',
			source: 'Inbox',
			detail: 'Utkastet är färdigt. Publicering sker först när du godkänner.',
			resolved: false
		},
		{
			id: 2,
			title: 'Lös anteckningskonflikt i “Ateljén”',
			source: 'Kunskap',
			detail: 'Två versioner innehåller olika stycken. Välj vilken som ska bli huvudversion.',
			resolved: false
		},
		{
			id: 3,
			title: 'Flytta personligt möte ons 19 aug?',
			source: 'Kalender',
			detail: 'Det överlappar med ett fokusblock. Ingen kalenderändring görs utan ditt beslut.',
			resolved: false
		}
	]);

	let authState = $state<AuthState>('loading');
	let session = $state<Session | null>(null);
	let previewMode = $state(false);
	let email = $state('');
	let authMessage = $state('');
	let authBusy = $state(false);
	let activeView = $state<View>('idag');
	let expandedAttention = $state<number | null>(null);
	let captureText = $state('');
	let captures = $state<Capture[]>([]);
	let attachments = $state<File[]>([]);
	let captureStatus = $state('Synkad');
	let captureBusy = $state(false);
	let listening = $state(false);
	let recognition: SpeechRecognitionLike | null = null;

	type SpeechRecognitionLike = {
		lang: string;
		interimResults: boolean;
		start: () => void;
		stop: () => void;
		onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
		onerror: (() => void) | null;
		onend: (() => void) | null;
	};

	const activeAttention = $derived(attention.filter((item) => !item.resolved));
	const dateParts = getDateParts();

	function getDateParts() {
		const now = new Date();
		const weekday = new Intl.DateTimeFormat('sv-SE', {
			weekday: 'long',
			timeZone: 'Europe/Stockholm'
		}).format(now);
		const day = new Intl.DateTimeFormat('sv-SE', {
			day: 'numeric',
			timeZone: 'Europe/Stockholm'
		}).format(now);
		const month = new Intl.DateTimeFormat('sv-SE', {
			month: 'long',
			timeZone: 'Europe/Stockholm'
		}).format(now);
		const year = new Intl.DateTimeFormat('sv-SE', {
			year: 'numeric',
			timeZone: 'Europe/Stockholm'
		}).format(now);

		return {
			weekday: weekday.toLocaleUpperCase('sv-SE'),
			day,
			month: month.toLocaleUpperCase('sv-SE'),
			year
		};
	}

	onMount(() => {
		let unsubscribe: (() => void) | undefined;
		previewMode = dev && new URLSearchParams(window.location.search).get('preview') === '1';
		if (previewMode) {
			authState = 'signed-in';
		} else if (!supabase) {
			authState = 'signed-out';
			authMessage = 'Supabase-miljön saknas. Lägg till de publika projektvariablerna för att logga in.';
		} else {
			supabase.auth.getSession().then(({ data }) => {
				session = data.session;
				authState = data.session ? 'signed-in' : 'signed-out';
			});

			const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
				session = nextSession;
				authState = nextSession ? 'signed-in' : 'signed-out';
			});
			unsubscribe = () => data.subscription.unsubscribe();
		}

		try {
			const stored = localStorage.getItem('nicole-admin-captures');
			captures = stored ? JSON.parse(stored) : [];
		} catch {
			captures = [];
		}

		return unsubscribe;
	});

	async function sendMagicLink(event: SubmitEvent) {
		event.preventDefault();
		if (!supabase || !email.trim()) return;
		authBusy = true;
		authMessage = '';
		const { error } = await supabase.auth.signInWithOtp({
			email: email.trim(),
			options: {
				emailRedirectTo: `${window.location.origin}/admin`,
				shouldCreateUser: false
			}
		});
		authBusy = false;
		if (error) console.error('Magic link failed:', error);
		// Same message either way — a distinct error would reveal which addresses have accounts.
		authMessage = 'Klart. Om adressen har åtkomst är en säker inloggningslänk skickad.';
	}

	async function signOut() {
		if (!supabase || previewMode) return;
		await supabase.auth.signOut();
	}

	function selectView(view: View) {
		activeView = view;
		expandedAttention = null;
	}

	function addAttachments(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const incoming = Array.from(input.files ?? []);
		attachments = [...attachments, ...incoming]
			.filter((file, index, files) => files.findIndex((candidate) => candidate.name === file.name && candidate.size === file.size) === index)
			.slice(0, 4);
		input.value = '';
	}

	function removeAttachment(file: File) {
		attachments = attachments.filter((item) => item !== file);
	}

	async function saveCapture(event: SubmitEvent) {
		event.preventDefault();
		const text = captureText.trim();
		if (!text && attachments.length === 0) return;
		captureBusy = true;
		captureStatus = 'Fångar…';

		let nextCapture: Capture = {
			id: crypto.randomUUID(),
			text: text || 'Bilaga utan text',
			createdAt: new Date().toISOString(),
			attachments: attachments.map((file) => file.name)
		};

		try {
			if (supabase && session && !previewMode) {
				const queued = await queueBrainCapture({
					client: supabase,
					userId: session.user.id,
					text,
					files: attachments
				});
				nextCapture = { ...nextCapture, id: queued.id, createdAt: queued.createdAt };
				captureStatus = queued.attachmentError ? 'Fångad · bilaga väntar' : 'I Markdown-kön';
			} else {
				captureStatus = 'Fångad lokalt';
			}
		} catch (error) {
			captureStatus = error instanceof Error ? `Kunde inte fånga: ${error.message}` : 'Kunde inte fånga';
			captureBusy = false;
			return;
		}

		captures = [nextCapture, ...captures];
		localStorage.setItem('nicole-admin-captures', JSON.stringify(captures));
		captureText = '';
		attachments = [];
		captureBusy = false;
		if (captureStatus !== 'Fångad · bilaga väntar') {
			window.setTimeout(() => (captureStatus = 'Synkad'), 1800);
		}
	}

	function toggleListening() {
		if (listening && recognition) {
			recognition.stop();
			return;
		}

		const speechWindow = window as typeof window & {
			SpeechRecognition?: new () => SpeechRecognitionLike;
			webkitSpeechRecognition?: new () => SpeechRecognitionLike;
		};
		const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
		if (!Recognition) {
			captureStatus = 'Röstinmatning stöds inte här';
			return;
		}

		recognition = new Recognition();
		recognition.lang = 'sv-SE';
		recognition.interimResults = false;
		recognition.onresult = (event) => {
			const transcript = event.results[0]?.[0]?.transcript ?? '';
			captureText = [captureText.trim(), transcript.trim()].filter(Boolean).join(' ');
		};
		recognition.onerror = () => {
			captureStatus = 'Kunde inte lyssna';
			listening = false;
		};
		recognition.onend = () => {
			listening = false;
			captureStatus = 'Redo att fånga';
		};
		listening = true;
		captureStatus = 'Lyssnar…';
		recognition.start();
	}

	function resolveAttention(id: number) {
		attention = attention.map((item) => (item.id === id ? { ...item, resolved: true } : item));
		expandedAttention = null;
	}
</script>

<svelte:head>
	<title>Min ateljé — Nicole Boman</title>
	<meta name="description" content="Nicoles privata second brain och personliga operativsystem." />
</svelte:head>

{#if authState === 'loading'}
	<div class="auth-shell" aria-live="polite">
		<a class="brand" href="/" aria-label="Nicole Boman — hem">N<span>.</span></a>
		<p class="mono-label auth-loading">Öppnar ateljén…</p>
	</div>
{:else if authState === 'signed-out'}
	<div class="auth-shell">
		<a class="brand" href="/" aria-label="Nicole Boman — hem">N<span>.</span></a>
		<main class="login-panel">
			<p class="mono-label">Privat rum / säker inloggning</p>
			<h1>Din privata <em>ateljé.</em></h1>
			<p class="login-copy">En plats för tankar, texter, relationer och det du vill göra härnäst.</p>
			<form onsubmit={sendMagicLink}>
				<label for="email">Din e-postadress</label>
				<div class="login-row">
					<input id="email" type="email" bind:value={email} autocomplete="email" required placeholder="nicole@…" />
					<button type="submit" disabled={authBusy || !supabase}>
						{authBusy ? 'Skickar…' : 'Skicka säker länk'}
						<ArrowRight size={20} weight="thin" aria-hidden="true" />
					</button>
				</div>
			</form>
			{#if authMessage}<p class="auth-message" aria-live="polite">{authMessage}</p>{/if}
		</main>
	</div>
{:else}
	<div class="admin-shell">
		<div class="admin-grid">
			<aside class="sidebar">
				<div>
					<a class="brand" href="/" aria-label="Nicole Boman — publik webbplats">N<span>.</span></a>
					<nav aria-label="Ateljéns delar">
						{#each navItems as item}
							<button
								type="button"
								class:active={activeView === item.id}
								onclick={() => selectView(item.id)}
							>
								<span class="nav-dot" aria-hidden="true"></span>{item.label}
							</button>
						{/each}
					</nav>
				</div>

				<div class="sidebar-bottom">
					<img src="/admin-artifact.png" alt="Abstrakt blå och siennaröd ljusstudie" width="98" height="136" />
					{#if session && !previewMode}
						<button class="sign-out" type="button" onclick={signOut} title="Logga ut">
							<SignOut size={16} weight="thin" aria-hidden="true" />
							<span>Logga ut</span>
						</button>
					{/if}
				</div>
			</aside>

			<div class="mobile-topbar">
				<a class="brand" href="/" aria-label="Nicole Boman — publik webbplats">N<span>.</span></a>
				<span class="mono-label">Min ateljé</span>
			</div>
			<nav class="mobile-nav" aria-label="Ateljéns delar, mobil">
				{#each navItems as item}
					<button type="button" class:active={activeView === item.id} onclick={() => selectView(item.id)}>
						{item.label}
					</button>
				{/each}
			</nav>

			{#if activeView === 'idag'}
				<main class="today-panel">
					<h1><span>{dateParts.weekday} /</span><span>{dateParts.day} {dateParts.month}</span></h1>
					<p class="date-stamp mono-label">{dateParts.day} {dateParts.month} {dateParts.year}</p>

					<section class="schedule" aria-label="Dagens agenda">
						{#each schedule as item}
							<article class="schedule-item">
								<time>{item.time}</time>
								<div class:focus={item.focus} class="schedule-marker"></div>
								<div>
									<h2>{item.title}</h2>
									<p>{item.note}</p>
									<span>{item.duration}</span>
								</div>
							</article>
						{/each}
					</section>
				</main>
			{:else}
				{@const module = moduleCopy[activeView]}
				<main class="module-panel">
					<p class="mono-label">{module.eyebrow}</p>
					<h1>{module.title}<span>.</span></h1>
					<p class="module-copy">{module.description}</p>
					{#if activeView === 'inbox' && captures.length > 0}
						<section class="capture-list" aria-label="Senaste fångster">
							{#each captures.slice(0, 5) as capture}
								<article>
									<p>{capture.text}</p>
									<time>{new Date(capture.createdAt).toLocaleString('sv-SE')}</time>
								</article>
							{/each}
						</section>
					{:else}
						<div class="module-rule"><span>Arbetsyta förberedd</span></div>
					{/if}
				</main>
			{/if}

			<aside class="attention-panel" id="attention">
				<p class="attention-title mono-label">Behöver dig / {String(activeAttention.length).padStart(2, '0')}</p>
				<div class="attention-list">
					{#each activeAttention as item}
						<article class:expanded={expandedAttention === item.id}>
							<button
								type="button"
								class="attention-open"
								onclick={() => (expandedAttention = expandedAttention === item.id ? null : item.id)}
								aria-expanded={expandedAttention === item.id}
							>
								<span class="attention-dot" aria-hidden="true"></span>
								<span class="attention-copy">
									<strong>{item.title}</strong>
									<small>{item.source}</small>
								</span>
								<span class="attention-arrow"><ArrowRight size={23} weight="thin" aria-hidden="true" /></span>
							</button>
							{#if expandedAttention === item.id}
								<div class="attention-detail">
									<p>{item.detail}</p>
									<div>
										<button type="button" onclick={() => resolveAttention(item.id)}>
											<Check size={16} weight="thin" aria-hidden="true" /> Godkänn
										</button>
										<button type="button" onclick={() => (expandedAttention = null)}>Senare</button>
									</div>
								</div>
							{/if}
						</article>
					{/each}
					{#if activeAttention.length === 0}
						<p class="attention-empty">Inget väntar på ditt beslut.</p>
					{/if}
				</div>
			</aside>

			<form class="capture" id="capture" onsubmit={saveCapture}>
				{#if attachments.length > 0}
					<div class="attachment-list" aria-label="Valda bilagor">
						{#each attachments as file (`${file.name}-${file.size}`)}
							<span>{file.name}<button type="button" onclick={() => removeAttachment(file)} aria-label={`Ta bort ${file.name}`}><X size={13} weight="thin" /></button></span>
						{/each}
					</div>
				{/if}
				<label class="sr-only" for="capture-text">Vad vill du fånga, förstå eller göra?</label>
				<textarea id="capture-text" bind:value={captureText} rows="1" placeholder="Vad vill du fånga, förstå eller göra?"></textarea>
				<div class="capture-actions">
					<button class:listening type="button" onclick={toggleListening} aria-label={listening ? 'Sluta lyssna' : 'Fånga med rösten'} title="Röstinmatning">
						<Microphone size={27} weight="regular" aria-hidden="true" />
					</button>
					<label class="file-button" aria-label="Lägg till bilaga" title="Lägg till bilaga">
						<Paperclip size={27} weight="regular" aria-hidden="true" />
						<input type="file" multiple onchange={addAttachments} disabled={captureBusy} />
					</label>
					<button class="send-button" type="submit" aria-label="Fånga" disabled={captureBusy}>
						<ArrowRight size={31} weight="regular" aria-hidden="true" />
					</button>
				</div>
			</form>

			<div class="statusbar">
				<span class="mono-label">Claude&nbsp;&nbsp;·&nbsp;&nbsp;OpenAI</span>
				<span class="sync-state mono-label"><i aria-hidden="true"></i>{captureStatus}&nbsp;&nbsp;&nbsp;&nbsp;{dateParts.day.toLowerCase()} {dateParts.month.toLowerCase()} {dateParts.year}, 08:42</span>
			</div>
		</div>
	</div>
{/if}

<style>
	:global(body) {
		margin: 0;
	}

	:global(.sr-only) {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.brand {
		color: var(--color-carbon);
		font-family: var(--font-display);
		font-size: 1.7rem;
		font-weight: 600;
		letter-spacing: -0.055em;
		line-height: 1;
		text-decoration: none;
	}

	.brand span,
	.module-panel h1 span {
		color: var(--color-sienna);
	}

	.auth-shell {
		box-sizing: border-box;
		display: grid;
		min-height: 100svh;
		padding: 40px;
		background: var(--color-gesso);
	}

	.auth-loading {
		place-self: center;
		color: var(--color-betong);
	}

	.login-panel {
		align-self: center;
		width: min(100%, 680px);
		margin: 0 auto;
		padding: 36px 0 42px;
		border-top: 1px solid var(--color-hairline);
		border-bottom: 1px solid var(--color-hairline);
	}

	.login-panel > .mono-label {
		color: var(--color-betong);
	}

	.login-panel h1 {
		max-width: 620px;
		margin: 26px 0 14px;
		font-family: var(--font-display);
		font-size: clamp(3.5rem, 8vw, 7rem);
		font-weight: 600;
		letter-spacing: -0.055em;
		line-height: 0.88;
	}

	.login-panel h1 em {
		font-family: var(--font-soft);
		font-weight: 400;
	}

	.login-copy {
		max-width: 45ch;
		margin: 0 0 54px;
		color: color-mix(in srgb, var(--color-carbon) 70%, transparent);
		font-size: 1.05rem;
		line-height: 1.55;
	}

	.login-panel label {
		display: block;
		margin-bottom: 10px;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.login-row {
		display: grid;
		grid-template-columns: 1fr auto;
		border-bottom: 1px solid var(--color-carbon);
	}

	.login-row input {
		min-width: 0;
		padding: 14px 0;
		border: 0;
		outline: 0;
		background: transparent;
		font: 1.2rem var(--font-sans);
	}

	.login-row button {
		display: inline-flex;
		align-items: center;
		gap: 16px;
		border: 0;
		background: transparent;
		font: 600 0.9rem var(--font-sans);
		cursor: pointer;
	}

	.login-row button:disabled {
		cursor: not-allowed;
		opacity: 0.45;
	}

	.auth-message {
		margin: 18px 0 0;
		color: var(--color-sienna);
		font-size: 0.9rem;
	}

	.admin-shell {
		box-sizing: border-box;
		min-height: 100svh;
		padding: 40px 49px 28px 40px;
		background: var(--color-gesso);
		color: var(--color-carbon);
	}

	.admin-grid {
		display: grid;
		grid-template-columns: 156px minmax(0, 1fr) 310px;
		grid-template-rows: minmax(0, 1fr) auto auto;
		column-gap: 48px;
		row-gap: 44px;
		min-height: calc(100svh - 68px);
	}

	.sidebar {
		position: relative;
		display: flex;
		grid-column: 1;
		grid-row: 1 / 4;
		flex-direction: column;
		justify-content: space-between;
		min-height: 0;
	}

	.sidebar nav {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 25px;
		margin-top: 82px;
	}

	.sidebar nav button {
		position: relative;
		padding: 0 0 0 20px;
		border: 0;
		background: none;
		color: var(--color-carbon);
		font: 400 1rem var(--font-sans);
		cursor: pointer;
	}

	.nav-dot {
		position: absolute;
		top: 50%;
		left: 0;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-sienna);
		transform: translateY(-50%) scale(0);
		transition: transform 160ms ease;
	}

	.sidebar nav button.active .nav-dot {
		transform: translateY(-50%) scale(1);
	}

	.sidebar-bottom {
		position: absolute;
		bottom: 196px;
		left: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;
		padding-bottom: 1px;
	}

	.sidebar-bottom img {
		display: block;
		width: 98px;
		height: 136px;
		object-fit: cover;
	}

	.sign-out {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--color-betong);
		font: 0.72rem var(--font-mono);
		cursor: pointer;
		text-transform: uppercase;
	}

	.mobile-topbar,
	.mobile-nav {
		display: none;
	}

	.today-panel,
	.module-panel {
		grid-column: 2;
		grid-row: 1;
		min-width: 0;
		padding-top: 93px;
	}

	.today-panel {
		padding-left: 48px;
	}

	.today-panel h1 {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(5.8rem, 10vw, 9.25rem);
		font-weight: 600;
		letter-spacing: -0.055em;
		line-height: 0.87;
		text-transform: uppercase;
	}

	.today-panel h1 span {
		display: block;
		white-space: nowrap;
	}

	.date-stamp {
		margin: 20px 0 26px 14px;
		color: var(--color-betong);
	}

	.schedule {
		max-width: 680px;
		margin-left: 16px;
		padding-top: 30px;
		border-top: 1px solid var(--color-hairline);
	}

	.schedule-item {
		display: grid;
		grid-template-columns: 78px 4px 1fr;
		gap: 24px;
		min-height: 118px;
	}

	.schedule-item:last-child {
		min-height: 98px;
	}

	.schedule-item > div:last-child {
		margin-left: 18px;
	}

	.schedule-item time,
	.schedule-item div:last-child > span {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.02em;
	}

	.schedule-marker {
		width: 3px;
		height: 79px;
		background: var(--color-hairline);
	}

	.schedule-marker.focus {
		background: var(--color-sienna);
	}

	.schedule-item h2 {
		margin: 0 0 4px;
		font-size: 1.15rem;
		font-weight: 600;
		line-height: 1.2;
	}

	.schedule-item p {
		margin: 0 0 7px;
		color: var(--color-betong);
		font-family: var(--font-soft);
		font-size: 1rem;
		font-style: italic;
		line-height: 1.25;
	}

	.schedule-item div:last-child > span {
		color: color-mix(in srgb, var(--color-carbon) 68%, transparent);
	}

	.module-panel > .mono-label {
		color: var(--color-betong);
	}

	.module-panel h1 {
		margin: 20px 0 14px;
		font-size: clamp(4.6rem, 9vw, 8.4rem);
		font-weight: 600;
		letter-spacing: -0.055em;
		line-height: 0.9;
	}

	.module-copy {
		max-width: 44ch;
		margin: 0;
		font-family: var(--font-soft);
		font-size: 1.4rem;
		font-style: italic;
		line-height: 1.35;
	}

	.module-rule,
	.capture-list {
		max-width: 680px;
		margin-top: 58px;
		border-top: 1px solid var(--color-hairline);
	}

	.module-rule span {
		display: block;
		padding-top: 16px;
		color: var(--color-betong);
		font: 0.72rem var(--font-mono);
		text-transform: uppercase;
	}

	.capture-list article {
		display: flex;
		justify-content: space-between;
		gap: 24px;
		padding: 18px 0;
		border-bottom: 1px solid var(--color-hairline);
	}

	.capture-list p {
		margin: 0;
	}

	.capture-list time {
		flex: 0 0 auto;
		color: var(--color-betong);
		font: 0.68rem var(--font-mono);
	}

	.attention-panel {
		grid-column: 3;
		grid-row: 1;
		padding-top: 121px;
	}

	.attention-title {
		margin: 0 0 18px;
		color: var(--color-carbon);
	}

	.attention-list {
		border-top: 1px solid var(--color-hairline);
	}

	.attention-list article {
		border-bottom: 1px solid var(--color-hairline);
	}

	.attention-open {
		display: grid;
		grid-template-columns: 9px 1fr auto;
		align-items: start;
		gap: 14px;
		width: 100%;
		min-height: 145px;
		padding: 28px 0 24px;
		border: 0;
		background: transparent;
		color: var(--color-carbon);
		text-align: left;
		cursor: pointer;
	}

	.attention-arrow {
		display: grid;
		place-items: center;
		align-self: center;
		transition: transform 180ms ease;
	}

	.attention-list article.expanded .attention-arrow {
		transform: rotate(90deg);
	}

	.attention-dot {
		width: 8px;
		height: 8px;
		margin-top: 5px;
		border-radius: 50%;
		background: var(--color-sienna);
	}

	.attention-copy strong,
	.attention-copy small {
		display: block;
	}

	.attention-copy strong {
		font-size: 1.14rem;
		font-weight: 600;
		line-height: 1.32;
	}

	.attention-copy small {
		margin-top: 12px;
		color: var(--color-betong);
		font: 0.72rem var(--font-mono);
	}

	.attention-detail {
		padding: 0 32px 22px 23px;
	}

	.attention-detail p {
		margin: 0 0 16px;
		color: color-mix(in srgb, var(--color-carbon) 72%, transparent);
		font-size: 0.86rem;
		line-height: 1.45;
	}

	.attention-detail > div {
		display: flex;
		gap: 16px;
	}

	.attention-detail button {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 0 0 3px;
		border: 0;
		border-bottom: 1px solid currentColor;
		background: none;
		color: var(--color-carbon);
		font: 0.72rem var(--font-mono);
		cursor: pointer;
		text-transform: uppercase;
	}

	.attention-empty {
		margin: 0;
		padding: 28px 0;
		color: var(--color-betong);
		font-family: var(--font-soft);
		font-style: italic;
	}

	.capture {
		display: grid;
		grid-column: 2 / 4;
		grid-row: 2;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: stretch;
		min-height: 108px;
		border: 1px solid var(--color-sienna);
		background: color-mix(in srgb, white 22%, transparent);
	}

	.capture textarea {
		box-sizing: border-box;
		width: 100%;
		min-height: 106px;
		max-height: 180px;
		padding: 31px 51px;
		resize: none;
		border: 0;
		outline: 0;
		background: transparent;
		color: var(--color-carbon);
		font: 400 1.9rem/1.35 var(--font-sans);
	}

	.capture textarea::placeholder {
		color: color-mix(in srgb, var(--color-carbon) 58%, transparent);
		opacity: 1;
	}

	.capture-actions {
		display: flex;
		align-items: center;
	}

	.capture-actions > button,
	.file-button {
		display: grid;
		place-items: center;
		box-sizing: border-box;
		width: 109px;
		height: 48px;
		border: 0;
		border-left: 1px solid color-mix(in srgb, var(--color-carbon) 30%, transparent);
		background: transparent;
		color: color-mix(in srgb, var(--color-carbon) 70%, transparent);
		cursor: pointer;
	}

	.capture-actions > button:first-child {
		border-left: 0;
		color: var(--color-sienna);
	}

	.capture-actions > button.listening {
		background: var(--color-sienna);
		color: var(--color-gesso);
	}

	.file-button input {
		display: none;
	}

	.capture-actions .send-button {
		color: var(--color-sienna);
	}

	.capture-actions .send-button:disabled {
		cursor: default;
		opacity: 0.45;
	}

	.attachment-list {
		display: flex;
		grid-column: 1 / 3;
		flex-wrap: wrap;
		gap: 7px;
		padding: 12px 16px 0;
	}

	.attachment-list span {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 4px 8px;
		border: 1px solid var(--color-hairline);
		font: 0.65rem var(--font-mono);
	}

	.attachment-list button {
		display: grid;
		place-items: center;
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
	}

	.statusbar {
		display: flex;
		grid-column: 2 / 4;
		grid-row: 3;
		align-items: center;
		justify-content: space-between;
		color: var(--color-betong);
	}

	.sync-state {
		display: inline-flex;
		align-items: center;
	}

	.sync-state i {
		width: 8px;
		height: 8px;
		margin-right: 12px;
		border-radius: 50%;
		background: var(--color-sienna);
	}

	@media (max-width: 1180px) {
		.admin-grid {
			grid-template-columns: 150px minmax(0, 1fr) 280px;
			column-gap: 28px;
		}

		.today-panel h1 {
			font-size: clamp(5rem, 9vw, 6.8rem);
		}

		.capture textarea {
			font-size: 1.35rem;
		}
	}

	@media (max-width: 920px) {
		.admin-shell {
			padding: 24px;
		}

		.admin-grid {
			grid-template-columns: minmax(0, 1fr) 280px;
			grid-template-rows: auto auto minmax(0, 1fr) auto auto;
			min-height: calc(100svh - 48px);
		}

		.sidebar {
			display: none;
		}

		.mobile-topbar {
			display: flex;
			grid-column: 1 / 3;
			grid-row: 1;
			align-items: center;
			justify-content: space-between;
		}

		.mobile-topbar .mono-label {
			color: var(--color-betong);
		}

		.mobile-nav {
			display: flex;
			grid-column: 1 / 3;
			grid-row: 2;
			gap: 22px;
			overflow-x: auto;
			padding: 12px 0 4px;
			scrollbar-width: none;
		}

		.mobile-nav button {
			flex: 0 0 auto;
			padding: 0 0 4px;
			border: 0;
			border-bottom: 1px solid transparent;
			background: none;
			font: 0.8rem var(--font-mono);
			cursor: pointer;
		}

		.mobile-nav button.active {
			border-color: var(--color-sienna);
			color: var(--color-sienna);
		}

		.today-panel,
		.module-panel {
			grid-column: 1;
			grid-row: 3;
			padding-top: 34px;
		}

		.attention-panel {
			grid-column: 2;
			grid-row: 3;
			padding-top: 58px;
		}

		.capture {
			grid-column: 1 / 3;
			grid-row: 4;
		}

		.statusbar {
			grid-column: 1 / 3;
			grid-row: 5;
		}
	}

	@media (max-width: 700px) {
		.admin-shell,
		.auth-shell {
			padding: 20px;
		}

		.admin-grid {
			display: block;
			min-height: auto;
		}

		.mobile-topbar {
			display: flex;
		}

		.mobile-nav {
			display: flex;
			margin-top: 16px;
		}

		.today-panel,
		.module-panel {
			padding-top: 42px;
		}

		.today-panel h1 {
			font-size: clamp(3.25rem, 16vw, 5.4rem);
		}

		.today-panel h1 span {
			white-space: normal;
		}

		.date-stamp {
			margin-left: 2px;
		}

		.schedule-item {
			grid-template-columns: 58px 3px 1fr;
			gap: 16px;
		}

		.attention-panel {
			padding-top: 42px;
		}

		.capture {
			position: sticky;
			bottom: 12px;
			z-index: 3;
			grid-template-columns: 1fr;
			margin-top: 44px;
			background: color-mix(in srgb, var(--color-gesso) 96%, white);
			box-shadow: 0 10px 36px color-mix(in srgb, var(--color-carbon) 12%, transparent);
		}

		.capture textarea {
			min-height: 86px;
			padding: 22px 20px;
			font-size: 1.12rem;
		}

		.capture-actions {
			justify-content: flex-end;
			border-top: 1px solid color-mix(in srgb, var(--color-carbon) 16%, transparent);
		}

		.capture-actions > button,
		.file-button {
			width: 64px;
			height: 48px;
		}

		.attachment-list {
			grid-column: 1;
			grid-row: 1;
		}

		.statusbar {
			display: flex;
			gap: 16px;
			margin-top: 17px;
		}

		.sync-state {
			text-align: right;
		}

		.login-panel {
			padding-top: 26px;
		}

		.login-panel h1 {
			font-size: clamp(3.2rem, 17vw, 5rem);
		}

		.login-row {
			grid-template-columns: 1fr;
		}

		.login-row button {
			justify-content: space-between;
			padding: 16px 0;
		}
	}
</style>
