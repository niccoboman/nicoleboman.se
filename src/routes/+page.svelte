<script lang="ts">
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';

	const t = $derived(translations[ui.lang]);

	const chapterMeta = [
		{ nr: '01', href: '/manifest' },
		{ nr: '02', href: '/om-mig' },
		{ nr: '03', href: '/arbete' },
		{ nr: '04', href: '/texter' },
		{ nr: '05', href: '/kontakt' }
	];

	const rosterNums = ['i.', 'ii.', 'iii.'];
</script>

<svelte:head>
	<title>Nicole Boman — {t.home.hero1} {t.home.hero2} & {t.home.hero3}</title>
</svelte:head>

<!-- Hero -->
<section class="flex min-h-[82svh] flex-col justify-between pt-20 pb-12 md:pt-24 md:pb-16">
	<h1
		class="font-display soften-in text-[clamp(3rem,8.8vw,7.25rem)] leading-[0.96] tracking-[-0.015em] text-ink"
		style="font-weight: 450;"
	>
		<span class="block">{t.home.hero1}</span>
		<span class="block italic" style="font-weight: 450;">{t.home.hero2}</span>
		<span class="block">
			<span class="italic text-sage" style="margin-right: 0.2em;">{t.home.heroConnector}</span
			>{t.home.hero3}<span class="text-sage">.</span>
		</span>
	</h1>

	<div class="mt-14 grid grid-cols-12 items-end gap-6 md:mt-20">
		<p
			class="rise-in col-span-12 max-w-[32ch] text-[1.05rem] leading-[1.42] text-ink md:col-span-6 md:text-[1.2rem]"
			style="animation-delay: 0.9s; font-weight: 380;"
		>
			{t.home.paraPre}<span
				class="font-display text-sage"
				style="font-weight: 500; font-style: normal;">{t.home.paraHighlight}</span
			>{t.home.paraPost}
		</p>
		<div
			class="rise-in font-mono col-span-12 flex flex-col gap-2 text-[0.72rem] uppercase text-ink md:col-span-6 md:items-end"
			style="animation-delay: 1.1s; letter-spacing: 0.16em;"
		>
			{#each t.home.roster as role, i}
				<div class="flex items-baseline gap-3 md:gap-4">
					<span class="text-ink">{rosterNums[i]}</span>
					<span class="select-none text-line">———</span>
					<span>{role}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<div class="rule my-10 md:my-16"></div>

<!-- Innehåll -->
<section class="grid grid-cols-12 gap-x-6 pb-8">
	<div class="col-span-12 md:col-span-3">
		<span class="font-mono text-[0.7rem] uppercase text-stone" style="letter-spacing: 0.18em;">
			{t.home.contents}
		</span>
	</div>
	<div class="col-span-12 mt-6 flex flex-col divide-y divide-line md:col-span-9 md:mt-0">
		{#each t.home.chapters as chapter, i}
			<a
				href={chapterMeta[i].href}
				class="group flex items-baseline gap-6 py-6 first:pt-0 md:gap-8"
			>
				<span
					class="font-mono text-[0.7rem] text-stone"
					style="letter-spacing: 0.14em;"
				>
					{chapterMeta[i].nr}
				</span>
				<div class="flex-1">
					<h2
						class="font-display text-[1.7rem] leading-tight text-ink transition-colors group-hover:italic group-hover:text-sage md:text-[2rem]"
						style="font-weight: 450;"
					>
						{chapter.title}
					</h2>
					<p class="mt-1 text-[0.98rem] leading-relaxed text-ink/70">
						{chapter.blurb}
					</p>
				</div>
				<span
					class="shrink-0 text-stone transition-transform group-hover:translate-x-1 group-hover:text-sage"
					>→</span
				>
			</a>
		{/each}
	</div>
</section>
