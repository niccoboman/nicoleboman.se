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

<article class="pt-14 pb-16 md:pt-24 md:pb-24">
	<!-- Chapter mark -->
	<div
		class="rise-in flex items-center gap-4 text-[0.72rem] uppercase text-stone"
		style="letter-spacing: 0.28em; animation-delay: 0.05s;"
	>
		<span>{number}</span>
		{#if subtitle}
			<span class="h-px w-8 bg-line"></span>
			<span>{subtitle}</span>
		{/if}
	</div>

	<!-- Big display title -->
	<h1
		class="soften-in mt-10 text-[clamp(3.5rem,9.5vw,7.5rem)] leading-[0.88] tracking-[-0.03em] text-ink md:mt-14"
	>
		{title}
	</h1>

	<!-- Rule separator -->
	<div class="rule mt-12 md:mt-16"></div>

	<!-- Content -->
	<div class="mt-12 max-w-3xl md:mt-16">
		{@render children()}
	</div>

	<!-- Chapter turn nav -->
	{#if prev || next}
		<nav
			class="mt-24 flex items-center justify-between border-t border-line pt-8 text-[0.72rem] uppercase text-stone md:mt-32"
			style="letter-spacing: 0.22em;"
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
