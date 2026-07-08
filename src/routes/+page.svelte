<script lang="ts">
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';
	import { reveal } from '$lib/reveal';
	import Clock from '$lib/components/Clock.svelte';
	import Artifact from '$lib/components/Artifact.svelte';
	import IndexRow from '$lib/components/IndexRow.svelte';

	const t = $derived(translations[ui.lang]);

	const chapterHrefs = ['/manifest', '/om-mig', '/arbete', '/texter', '/kontakt'];
	const chapterNrs = ['01', '02', '03', '04', '05'];
</script>

<svelte:head>
	<title>Nicole Boman — {t.common.role}</title>
</svelte:head>

<!-- Hero -->
<section class="relative flex min-h-[92svh] flex-col justify-between pb-[6vh] pt-[10vh]">
	<div class="mono-label flex items-baseline justify-between">
		<span>{t.common.role}</span>
		<span class="text-betong">{t.common.city} <Clock /> · {t.common.coords}</span>
	</div>

	<div class="absolute right-0 top-[16vh] hidden md:block">
		<Artifact caption={t.common.artifactCaption} />
	</div>

	<h1 class="font-display text-[clamp(3.4rem,11.4vw,10.6rem)] font-semibold uppercase leading-[0.9] tracking-[-0.025em]">
		{#each t.home.heroLines as line, i}
			<span class="ln {i === 1 ? 'pl-[clamp(2rem,9vw,9rem)]' : i === 2 ? 'pl-[clamp(4rem,18vw,18rem)]' : ''}">
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
		<Artifact caption={t.common.artifactCaption} />
	</div>
</section>

<!-- Manifestrad — sidans enda mjuka ögonblick -->
<section class="py-[22vh]" use:reveal>
	<span class="mono-label mb-[4vh] block text-betong">{t.home.manifestLabel}</span>
	<p class="reveal font-soft max-w-[22ch] text-[clamp(1.8rem,4.4vw,3.6rem)] leading-[1.15] tracking-[-0.01em]">
		{t.home.manifestQuote}
	</p>
</section>

<!-- Index -->
<section class="pb-[16vh]" use:reveal>
	<span class="mono-label reveal mb-[3vh] block text-betong">{t.home.indexLabel}</span>
	{#each t.home.chapters as chapter, i}
		<IndexRow nr={chapterNrs[i]} title={chapter.title} desc={chapter.desc} href={chapterHrefs[i]} />
	{/each}
</section>
