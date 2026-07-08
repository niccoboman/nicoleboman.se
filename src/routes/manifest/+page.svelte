<script lang="ts">
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';
	import { reveal } from '$lib/reveal';
	import PageTitle from '$lib/components/PageTitle.svelte';

	const t = $derived(translations[ui.lang]);
</script>

<svelte:head>
	<title>{t.nav.manifest} · Nicole Boman</title>
</svelte:head>

<article class="pb-[16vh] pt-[10vh]">
	<PageTitle label={t.manifest.label} lines={t.manifest.titleLines} punkt />

	<!-- Manifestets teser — serifen bär (medvetet undantag från en-per-sida-regeln) -->
	<div class="mt-[14vh] flex flex-col gap-[10vh]">
		{#each t.manifest.theses as thesis}
			<div class="flex flex-col gap-4 md:flex-row md:gap-[clamp(24px,6vw,96px)]" use:reveal>
				<span class="mono-label reveal shrink-0 pt-3 text-sienna">{thesis.nr}</span>
				<p class="reveal font-soft max-w-[26ch] text-[clamp(1.6rem,3.6vw,3rem)] leading-[1.2] tracking-[-0.01em]">
					{thesis.text}
				</p>
			</div>
		{/each}
	</div>
</article>
