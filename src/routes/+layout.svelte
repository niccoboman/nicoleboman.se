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
	<header class="flex items-baseline justify-between pt-8 md:pt-10">
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
					{link.label}
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
			<span class="font-display normal-case italic" style="letter-spacing: 0.01em; font-size: 0.88rem;">info@nicoleboman.se</span>
			<span>Stockholm · Sverige</span>
		</div>
	</footer>
</div>
