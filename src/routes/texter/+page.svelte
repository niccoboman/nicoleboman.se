<script lang="ts">
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';
	import { reveal } from '$lib/reveal';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import IndexRow from '$lib/components/IndexRow.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const t = $derived(translations[ui.lang]);
</script>

<svelte:head>
	<title>{t.nav.writing} · Nicole Boman</title>
</svelte:head>

<article class="pb-[10vh] pt-[6vh] md:pb-[16vh] md:pt-[10vh]">
	<PageTitle label={t.writing.label} lines={t.writing.titleLines} />

	<div class="mt-[8vh] md:mt-[12vh]" use:reveal>
		<span class="mono-label reveal mb-[3vh] block text-betong">{t.writing.subtitle}</span>
		{#each data.texter as text, i}
			<IndexRow
				nr={String(i + 1).padStart(2, '0')}
				title={text.titel}
				meta={text.ar}
				href={text.extern ?? `/texter/${text.slug}`}
				external={Boolean(text.extern)}
			/>
		{/each}
	</div>

	<div class="mt-[8vh]" use:reveal>
		<a
			href="https://bomannicole.substack.com/"
			target="_blank"
			rel="noopener noreferrer"
			class="mono-label reveal inline-block text-carbon no-underline transition-colors hover:text-sienna"
		>
			{t.writing.allCta}
		</a>
	</div>
</article>
