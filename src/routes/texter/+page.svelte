<script lang="ts">
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';
	import { reveal } from '$lib/reveal';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import IndexRow from '$lib/components/IndexRow.svelte';

	const t = $derived(translations[ui.lang]);

	const texter = [
		{ title: 'Time Out', year: '2025', href: 'https://bomannicole.substack.com/p/time-out' },
		{
			title: 'Defining Artificial Intelligence',
			year: '2025',
			href: 'https://bomannicole.substack.com/p/defining-artificial-intelligence'
		},
		{
			title: 'Is Marketing Ruining Art?',
			year: '2024',
			href: 'https://bomannicole.substack.com/p/is-marketing-ruining-art'
		}
	];
</script>

<svelte:head>
	<title>{t.nav.writing} · Nicole Boman</title>
</svelte:head>

<article class="pb-[16vh] pt-[10vh]">
	<PageTitle label={t.writing.label} lines={t.writing.titleLines} />

	<div class="mt-[12vh]" use:reveal>
		<span class="mono-label reveal mb-[3vh] block text-betong">{t.writing.subtitle}</span>
		{#each texter as text, i}
			<IndexRow nr={String(i + 1).padStart(2, '0')} title={text.title} meta={text.year} href={text.href} external />
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
