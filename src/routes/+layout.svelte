<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';

	let { children } = $props();

	const navLinks = [
		{ href: '/manifest', label: 'Manifest' },
		{ href: '/om-mig', label: 'Om mig' },
		{ href: '/arbete', label: 'Arbete' },
		{ href: '/texter', label: 'Texter' },
		{ href: '/kontakt', label: 'Kontakt' }
	];
</script>

<svelte:head>
	<title>Nicole Boman</title>
</svelte:head>

<div class="relative mx-auto flex min-h-svh max-w-[1240px] flex-col px-6 md:px-12 lg:px-20">
	<header class="flex items-baseline justify-between pt-8 md:pt-12">
		<a
			href="/"
			class="font-display text-[1.35rem] leading-none tracking-tight text-ink transition-colors hover:text-clay"
			style="font-variation-settings: 'opsz' 48, 'SOFT' 60, 'wght' 400;"
		>
			Nicole Boman
		</a>
		<nav
			class="flex items-center gap-7 text-[0.72rem] uppercase"
			style="letter-spacing: 0.22em;"
		>
			{#each navLinks as link}
				{@const active = page.url.pathname === link.href}
				<a
					href={link.href}
					class="relative transition-colors hover:text-ink {active
						? 'text-ink'
						: 'text-stone'}"
				>
					{link.label}
					{#if active}
						<span
							class="absolute -bottom-2 left-0 right-0 mx-auto block h-px w-3 bg-clay"
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
			class="flex flex-col gap-2 text-[0.72rem] uppercase text-stone md:flex-row md:items-center md:justify-between"
			style="letter-spacing: 0.22em;"
		>
			<span>© {new Date().getFullYear()} Nicole Boman</span>
			<span>Stockholm · Sverige</span>
		</div>
	</footer>
</div>
