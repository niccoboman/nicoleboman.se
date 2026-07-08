<script lang="ts">
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';
	import { reveal } from '$lib/reveal';
	import PageTitle from '$lib/components/PageTitle.svelte';

	const t = $derived(translations[ui.lang]);
</script>

<svelte:head>
	<title>{t.nav.work} · Nicole Boman</title>
</svelte:head>

<article class="pb-[10vh] pt-[6vh] md:pb-[16vh] md:pt-[10vh]">
	<PageTitle label={t.work.label} lines={t.work.titleLines} />

	<div class="mt-[8vh] md:mt-[12vh]" use:reveal>
		{#each t.work.items as item}
			<section class="reveal grid grid-cols-1 gap-4 border-t border-hairline py-[clamp(24px,4vw,48px)] md:grid-cols-12 md:gap-x-[clamp(24px,4vw,64px)]">
				<span class="mono-label text-betong md:col-span-1">{item.nr}</span>
				<h2 class="font-display text-[clamp(1.9rem,5vw,4.4rem)] font-semibold uppercase leading-none tracking-[-0.02em] md:col-span-6">
					{item.title}
				</h2>
				<p class="max-w-[38ch] text-[0.95rem] leading-[1.55] text-carbon/75 md:col-span-5 md:justify-self-end md:text-right">
					{item.desc}
				</p>
			</section>
		{/each}
	</div>

	<div class="mt-[8vh] md:mt-[10vh]" use:reveal>
		<a
			href="https://studiosten.se"
			target="_blank"
			rel="noopener noreferrer"
			class="mono-label reveal inline-block text-carbon no-underline transition-colors hover:text-sienna"
		>
			{t.work.bookingCta}
		</a>
	</div>
</article>
