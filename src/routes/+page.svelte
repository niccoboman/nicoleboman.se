<script lang="ts">
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';
	import { reveal } from '$lib/reveal';
	import Artifact from '$lib/components/Artifact.svelte';
	import IndexRow from '$lib/components/IndexRow.svelte';

	const t = $derived(translations[ui.lang]);

	const chapterHrefs = ['/om-mig', '/arbete', '/texter', '/kontakt'];
	const chapterNrs = ['01', '02', '03', '04'];
</script>

<svelte:head>
	<title>Nicole Boman — {t.common.role}</title>
</svelte:head>

<!-- Hero -->
<section class="relative flex min-h-[92svh] flex-col justify-between pb-[6vh] pt-[10vh]">
	<div class="mono-label">
		<span>{t.common.role}</span>
	</div>

	<div class="absolute right-0 top-[16vh] hidden md:block">
		<Artifact />
	</div>

	<h1 class="font-display text-[clamp(2.6rem,11.4vw,10.6rem)] font-semibold uppercase leading-[0.9] tracking-[-0.025em]">
		{#each t.home.heroLines as line, i}
			<span class="ln {i === 1 ? 'pl-[clamp(1rem,9vw,9rem)]' : i === 2 ? 'pl-[clamp(2rem,18vw,18rem)]' : ''}">
				<span>{line}{#if i === t.home.heroLines.length - 1}<span class="text-sienna">.</span>{/if}</span>
			</span>
		{/each}
	</h1>

	<div class="mono-label fade-in flex items-end justify-between gap-8">
		<p class="max-w-[38ch] font-sans text-[0.95rem] normal-case leading-[1.5] tracking-normal text-carbon/75">
			{t.home.intro}
		</p>
		<span class="hidden text-betong md:block">{t.common.scroll}</span>
	</div>

	<div class="mt-[8vh] md:hidden">
		<Artifact />
	</div>
</section>

<!-- Index -->
<section class="pb-[16vh] pt-[14vh]" use:reveal>
	<span class="mono-label reveal mb-[3vh] block text-betong">{t.home.indexLabel}</span>
	{#each t.home.chapters as chapter, i}
		<IndexRow nr={chapterNrs[i]} title={chapter.title} desc={chapter.desc} href={chapterHrefs[i]} />
	{/each}
</section>
