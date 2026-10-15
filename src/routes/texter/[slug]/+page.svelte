<script lang="ts">
	import { reveal } from '$lib/reveal';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.text.titel} · Nicole Boman</title>
</svelte:head>

<article class="px-[clamp(16px,3vw,40px)] pt-[10vh]">
	<div class="etikett flex flex-wrap items-baseline gap-x-6 gap-y-2 text-grafit">
		<a href="/" class="streck text-svart">← Nicole Boman</a>
		<span class="ml-auto">{data.text.datum}</span>
	</div>

	<h1
		class="jatte mt-[8vh] max-w-[14ch] text-[clamp(3rem,10vw,10rem)]"
	>
		{data.text.titel}
	</h1>

	<div class="prosa mx-auto mt-[10vh] max-w-[64ch]" use:reveal>
		<!-- eslint-disable-next-line svelte/no-at-html-tags — HTML renderas från egna markdown-filer i repot -->
		{@html data.text.html}
	</div>
</article>

<style>
	.prosa :global(p) {
		margin-bottom: 1.4em;
		font-family: var(--font-arkiv);
		font-size: clamp(1.1rem, 1.25vw, 1.25rem);
		line-height: 1.7;
		color: var(--color-svart);
	}
	.prosa :global(h2),
	.prosa :global(h3) {
		margin: 2.4em 0 0.8em;
		font-family: var(--font-arkiv);
		font-weight: 400;
		letter-spacing: -0.015em;
		line-height: 1.05;
	}
	.prosa :global(h2) {
		font-size: clamp(1.3rem, 2.4vw, 1.9rem);
	}
	.prosa :global(h3) {
		font-size: clamp(1.1rem, 1.8vw, 1.4rem);
	}
	.prosa :global(a) {
		color: var(--color-svart);
		text-decoration: underline;
		text-underline-offset: 3px;
		transition: color 0.2s;
	}
	.prosa :global(a:hover) {
		color: var(--color-grafit);
	}
	.prosa :global(blockquote) {
		margin: 2em 0;
		border-left: 1px solid var(--color-linje);
		padding-left: 1.4em;
		color: var(--color-grafit);
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
		border-top: 1px solid var(--color-linje);
	}
	.prosa :global(code) {
		font-family: var(--font-mono);
		font-size: 0.85em;
	}
</style>
