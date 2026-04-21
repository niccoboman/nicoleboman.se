<script lang="ts">
	import ChapterPage from '$lib/components/ChapterPage.svelte';
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';

	const t = $derived(translations[ui.lang]);
</script>

<svelte:head>
	<title>{t.work.title} · Nicole Boman</title>
</svelte:head>

<ChapterPage
	number="03"
	title={t.work.title}
	prev={{ href: '/om-mig', label: t.nav.about }}
	next={{ href: '/texter', label: t.nav.writing }}
>
	<div class="flex flex-col divide-y divide-line">
		{#each t.work.items as item, i}
			<div class="group flex items-baseline gap-8 py-7 first:pt-0">
				<span class="font-mono text-[0.7rem] text-stone" style="letter-spacing: 0.14em;">
					{String(i + 1).padStart(2, '0')}
				</span>
				<div class="flex-1">
					<h3
						class="font-display text-[1.75rem] leading-tight text-ink md:text-[2.1rem]"
						style="font-weight: 450;"
					>
						{item.label}
					</h3>
					<p class="mt-2 max-w-xl text-[1.02rem] leading-relaxed text-ink/80">
						{item.desc}
					</p>
				</div>
			</div>
		{/each}
	</div>

	<div class="mt-10">
		<a
			href="https://studiosten.se"
			target="_blank"
			rel="noopener noreferrer"
			class="group font-mono inline-flex items-center gap-3 text-[0.72rem] uppercase text-stone transition-colors hover:text-sage"
			style="letter-spacing: 0.16em;"
		>
			<span>{t.work.bookingCta}</span>
			<span class="inline-block transition-transform group-hover:translate-x-1">→</span>
		</a>
	</div>
</ChapterPage>
