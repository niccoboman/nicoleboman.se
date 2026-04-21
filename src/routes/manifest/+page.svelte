<script lang="ts">
	import ChapterPage from '$lib/components/ChapterPage.svelte';
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';

	const t = $derived(translations[ui.lang]);
</script>

<svelte:head>
	<title>{t.manifest.title} · Nicole Boman</title>
</svelte:head>

<ChapterPage
	number="01"
	title={t.manifest.title}
	next={{ href: '/om-mig', label: t.nav.about }}
>
	<p
		class="font-display text-[1.75rem] leading-[1.24] text-ink md:text-[2.4rem]"
		style="font-weight: 450;"
	>
		<em class="italic">{t.manifest.part1}</em>{t.manifest.part2}<em class="italic text-sage"
			>{t.manifest.human}</em
		>{t.manifest.part3}
	</p>
</ChapterPage>
