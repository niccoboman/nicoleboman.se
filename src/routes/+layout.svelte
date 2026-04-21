<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';

	let { children } = $props();

	const t = $derived(translations[ui.lang]);

	const navLinks = [
		{ href: '/manifest', key: 'manifest' as const },
		{ href: '/om-mig', key: 'about' as const },
		{ href: '/arbete', key: 'work' as const },
		{ href: '/texter', key: 'writing' as const },
		{ href: '/kontakt', key: 'contact' as const }
	];
</script>

<svelte:head>
	<title>Nicole Boman</title>
</svelte:head>

<div class="relative mx-auto flex min-h-svh max-w-[1240px] flex-col px-6 md:px-12 lg:px-20">
	<!-- Utility bar: language + theme -->
	<div
		class="font-mono flex justify-end gap-6 pt-4 text-[0.68rem] uppercase"
		style="letter-spacing: 0.14em;"
	>
		<button
			type="button"
			onclick={() => ui.toggleLang()}
			class="flex items-baseline gap-1.5 transition-colors hover:text-ink"
			aria-label={t.common.langLabel}
		>
			<span class={ui.lang === 'sv' ? 'text-ink' : 'text-stone/60'}>SV</span>
			<span class="text-line">/</span>
			<span class={ui.lang === 'en' ? 'text-ink' : 'text-stone/60'}>EN</span>
		</button>
		<button
			type="button"
			onclick={() => ui.toggleTheme()}
			class="flex items-baseline gap-1.5 transition-colors hover:text-ink"
			style="font-size: 0.82rem;"
			aria-label={t.common.themeLabel}
		>
			<span class={ui.theme === 'light' ? 'text-ink' : 'text-stone/60'}>☀</span>
			<span class="text-line">/</span>
			<span class={ui.theme === 'dark' ? 'text-ink' : 'text-stone/60'}>☾</span>
		</button>
	</div>

	<header class="flex items-baseline justify-between pt-4 md:pt-6">
		<a
			href="/"
			class="font-display text-[1.15rem] leading-none tracking-tight text-ink transition-colors hover:text-sage"
			style="font-weight: 500;"
		>
			Nicole Boman
		</a>
		<nav
			class="font-mono flex items-center gap-6 text-[0.72rem] uppercase md:gap-8"
			style="letter-spacing: 0.16em;"
		>
			{#each navLinks as link}
				{@const active = page.url.pathname === link.href}
				<a
					href={link.href}
					class="relative transition-colors hover:text-ink {active
						? 'text-ink'
						: 'text-stone'}"
				>
					{t.nav[link.key]}
					{#if active}
						<span
							class="absolute -bottom-2 left-0 right-0 mx-auto block h-px w-3 bg-sage"
						></span>
					{/if}
				</a>
			{/each}
		</nav>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="mt-16 pt-6 pb-10">
		<div
			class="font-mono flex flex-col gap-2 text-[0.7rem] uppercase text-stone md:flex-row md:items-center md:justify-between"
			style="letter-spacing: 0.16em;"
		>
			<span>© {new Date().getFullYear()} Nicole Boman</span>
			<span
				class="font-display normal-case italic"
				style="letter-spacing: 0.01em; font-size: 0.88rem;">info@nicoleboman.se</span
			>
			<span>{t.common.country}</span>
		</div>
	</footer>
</div>
