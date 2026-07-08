<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';
	import { reveal } from '$lib/reveal';

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

<div class="mx-auto max-w-[1440px] px-[clamp(20px,3.5vw,56px)]">
	<header class="flex items-center justify-between pt-[26px]">
		<a href="/" class="font-display text-[0.95rem] font-semibold tracking-[-0.01em] text-carbon no-underline">
			Nicole Boman
		</a>
		<div class="flex items-center gap-[clamp(18px,3vw,40px)]">
			<nav class="hidden gap-[clamp(18px,3vw,40px)] md:flex">
				{#each navLinks as link}
					{@const active = page.url.pathname === link.href}
					<a
						href={link.href}
						class="text-[0.8rem] no-underline transition-colors hover:text-carbon {active
							? 'text-carbon'
							: 'text-betong'}"
					>
						{t.nav[link.key]}
					</a>
				{/each}
			</nav>
			<button
				type="button"
				onclick={() => ui.toggleLang()}
				aria-label={t.common.langLabel}
				class="mono-label cursor-pointer border-0 bg-transparent p-0 text-betong transition-colors hover:text-carbon"
			>
				{ui.lang === 'sv' ? 'EN' : 'SV'}
			</button>
		</div>
	</header>

	<nav class="mt-4 flex flex-wrap gap-x-5 gap-y-2 md:hidden">
		{#each navLinks as link}
			{@const active = page.url.pathname === link.href}
			<a
				href={link.href}
				class="mono-label no-underline transition-colors hover:text-carbon {active
					? 'text-carbon'
					: 'text-betong'}"
			>
				{t.nav[link.key]}
			</a>
		{/each}
	</nav>

	<main>
		{@render children()}
	</main>
</div>

<footer class="bg-carbon pb-9 pt-[16vh] text-gesso" use:reveal>
	<div class="mx-auto max-w-[1440px] px-[clamp(20px,3.5vw,56px)]">
		<p class="reveal font-display text-[clamp(2.8rem,9vw,8rem)] font-semibold uppercase leading-[0.92] tracking-[-0.025em] whitespace-pre-line">{t.footer.cta}
			<a href="mailto:info@nicoleboman.se" class="inline-block text-gesso no-underline transition-colors hover:text-sienna">{t.footer.ctaLink}</a></p>
		<div class="reveal mt-[10vh] flex flex-wrap items-baseline justify-between gap-6 border-t border-gesso/15 pt-6">
			<span class="mono-label text-gesso/55">© {new Date().getFullYear()} Nicole Boman</span>
			<a class="mono-label text-gesso/55 no-underline transition-colors hover:text-gesso" href="https://www.linkedin.com/in/nicoleboman/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
			<a class="mono-label text-gesso/55 no-underline transition-colors hover:text-gesso" href="https://bomannicole.substack.com/" target="_blank" rel="noopener noreferrer">Substack</a>
			<span class="mono-label text-gesso/55">{t.footer.place}</span>
		</div>
	</div>
</footer>
