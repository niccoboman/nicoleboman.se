<script lang="ts">
	interface NavLink {
		href: string;
		label: string;
	}

	interface Props {
		number: string;
		title: string;
		subtitle?: string;
		prev?: NavLink;
		next?: NavLink;
		children: import('svelte').Snippet;
	}

	let { number, title, subtitle, prev, next, children }: Props = $props();
</script>

<article class="pt-12 pb-16 md:pt-20 md:pb-24">
	<!-- Chapter mark -->
	<div
		class="rise-in font-mono flex items-center gap-4 text-[0.7rem] uppercase text-stone"
		style="letter-spacing: 0.18em; animation-delay: 0.05s;"
	>
		<span>{number}</span>
		{#if subtitle}
			<span class="h-px w-8 bg-line"></span>
			<span class="font-display italic normal-case text-wine" style="letter-spacing: 0.01em; font-size: 0.9rem;">{subtitle}</span>
		{/if}
	</div>

	<!-- Big display title -->
	<h1
		class="font-display soften-in mt-8 text-[clamp(3rem,8.5vw,6.75rem)] leading-[0.94] tracking-[-0.015em] text-ink md:mt-12"
		style="font-weight: 450;"
	>
		{title}
	</h1>

	<!-- Rule separator -->
	<div class="rule mt-10 md:mt-14"></div>

	<!-- Content -->
	<div class="mt-10 max-w-3xl md:mt-14">
		{@render children()}
	</div>

	<!-- Chapter turn nav -->
	{#if prev || next}
		<nav
			class="font-mono mt-20 flex items-center justify-between border-t border-line pt-6 text-[0.7rem] uppercase text-stone md:mt-28"
			style="letter-spacing: 0.18em;"
		>
			{#if prev}
				<a
					href={prev.href}
					class="group flex items-center gap-3 transition-colors hover:text-ink"
				>
					<span class="inline-block transition-transform group-hover:-translate-x-1">←</span>
					<span>{prev.label}</span>
				</a>
			{:else}
				<span></span>
			{/if}

			{#if next}
				<a
					href={next.href}
					class="group flex items-center gap-3 transition-colors hover:text-ink"
				>
					<span>{next.label}</span>
					<span class="inline-block transition-transform group-hover:translate-x-1">→</span>
				</a>
			{:else}
				<span></span>
			{/if}
		</nav>
	{/if}
</article>
