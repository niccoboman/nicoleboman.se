<script lang="ts">
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';
	import { reveal } from '$lib/reveal';
	import PageTitle from '$lib/components/PageTitle.svelte';

	const t = $derived(translations[ui.lang]);
</script>

<svelte:head>
	<title>{t.nav.about} · Nicole Boman</title>
</svelte:head>

<article class="pb-[10vh] pt-[6vh] md:pb-[16vh] md:pt-[10vh]">
	<PageTitle label={t.about.label} lines={t.about.titleLines} />

	<div class="mt-[8vh] grid grid-cols-1 gap-[8vh] md:mt-[12vh] md:grid-cols-12 md:gap-x-[clamp(24px,4vw,64px)]">
		<div class="md:col-span-7" use:reveal>
			<!-- Sidans enda mjuka ögonblick -->
			<p class="reveal font-soft max-w-[24ch] text-[clamp(1.7rem,3.8vw,3.2rem)] leading-[1.18] tracking-[-0.01em]">
				{t.about.lede}
			</p>
			<div class="mt-[8vh] flex max-w-[52ch] flex-col gap-6 text-[0.98rem] leading-[1.6] text-carbon/80">
				<p class="reveal">{t.about.p1}</p>
				<p class="reveal">{t.about.p2}</p>
				<p class="reveal">{t.about.p3}</p>
			</div>
		</div>

		<div class="md:col-span-4 md:col-start-9" use:reveal>
			<dl class="reveal flex flex-col">
				{#each t.about.facts as fact}
					<div class="flex items-baseline justify-between border-t border-hairline py-3 last:border-b">
						<dt class="mono-label text-betong">{fact.label}</dt>
						<dd class="text-[0.85rem] text-carbon">{fact.value}</dd>
					</div>
				{/each}
			</dl>
		</div>
	</div>
</article>
