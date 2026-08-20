<script lang="ts">
	import { ui } from '$lib/state.svelte';
	import { reveal } from '$lib/reveal';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const tillbaka = $derived(ui.lang === 'sv' ? '← Alla texter' : '← All writing');
</script>

<svelte:head>
	<title>{data.text.titel} · Nicole Boman</title>
</svelte:head>

<article class="pb-[10vh] pt-[6vh] md:pb-[16vh] md:pt-[10vh]">
	<div class="mono-label flex flex-wrap items-baseline gap-x-6 gap-y-2 text-betong">
		<a href="/texter" class="text-carbon no-underline transition-colors hover:text-sienna">{tillbaka}</a>
		<span class="ml-auto">[ {data.text.datum} ]</span>
		<span>[ {data.text.sprak.toUpperCase()} ]</span>
	</div>

	<h1
		class="mt-[6vh] max-w-[16ch] font-display text-[clamp(2.2rem,7vw,5.6rem)] font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-carbon"
	>
		{data.text.titel}
	</h1>

	<div class="prosa mt-[8vh] max-w-[68ch]" use:reveal>
		<!-- eslint-disable-next-line svelte/no-at-html-tags — HTML renderas från egna markdown-filer i repot -->
		{@html data.text.html}
	</div>
</article>

<style>
	.prosa :global(p) {
		margin-bottom: 1.4em;
		font-size: clamp(1rem, 1.15vw, 1.15rem);
		line-height: 1.65;
		color: var(--color-carbon);
	}
	.prosa :global(h2),
	.prosa :global(h3) {
		margin: 2.4em 0 0.8em;
		font-family: var(--font-display);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: -0.01em;
		line-height: 1.05;
	}
	.prosa :global(h2) {
		font-size: clamp(1.3rem, 2.4vw, 1.9rem);
	}
	.prosa :global(h3) {
		font-size: clamp(1.1rem, 1.8vw, 1.4rem);
	}
	.prosa :global(em) {
		font-family: var(--font-soft);
		font-style: italic;
	}
	.prosa :global(a) {
		color: var(--color-carbon);
		text-decoration: underline;
		text-underline-offset: 3px;
		transition: color 0.2s;
	}
	.prosa :global(a:hover) {
		color: var(--color-sienna);
	}
	.prosa :global(blockquote) {
		margin: 2em 0;
		border-left: 1px solid var(--color-hairline);
		padding-left: 1.4em;
		color: var(--color-betong);
	}
	.prosa :global(ul),
	.prosa :global(ol) {
		margin: 0 0 1.4em 1.2em;
		line-height: 1.65;
	}
	.prosa :global(ul) {
		list-style: disc;
	}
	.prosa :global(ol) {
		list-style: decimal;
	}
	.prosa :global(hr) {
		margin: 3em 0;
		border: 0;
		border-top: 1px solid var(--color-hairline);
	}
	.prosa :global(code) {
		font-family: var(--font-mono);
		font-size: 0.85em;
	}
</style>
