<script lang="ts">
	import ChapterPage from '$lib/components/ChapterPage.svelte';
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';

	const t = $derived(translations[ui.lang]);
</script>

<svelte:head>
	<title>{t.contact.title} · Nicole Boman</title>
</svelte:head>

<ChapterPage
	number="05"
	title={t.contact.title}
	prev={{ href: '/texter', label: t.nav.writing }}
>
	<a href="mailto:info@nicoleboman.se" class="group inline-block">
		<span
			class="font-display text-[2.1rem] leading-tight text-ink transition-colors group-hover:italic group-hover:text-sage md:text-[3.1rem]"
			style="font-weight: 450;"
		>
			info@nicoleboman.se
		</span>
	</a>

	<div
		class="font-mono mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[0.72rem] uppercase text-stone"
		style="letter-spacing: 0.16em;"
	>
		<a
			class="transition-colors hover:text-sage"
			href="https://www.linkedin.com/in/nicoleboman/"
			target="_blank"
			rel="noopener noreferrer">LinkedIn ↗</a
		>
		<a
			class="transition-colors hover:text-sage"
			href="https://bomannicole.substack.com/"
			target="_blank"
			rel="noopener noreferrer">Substack ↗</a
		>
		<a
			class="transition-colors hover:text-sage"
			href="https://studiosten.se"
			target="_blank"
			rel="noopener noreferrer">Studio Stén ↗</a
		>
	</div>

	<p class="mt-12 max-w-2xl text-[1.05rem] leading-relaxed text-ink/80">
		{t.contact.bodyPre}<a
			class="text-sage underline decoration-line decoration-from-font underline-offset-4 transition hover:decoration-sage"
			href="https://studiosten.se"
			target="_blank"
			rel="noopener noreferrer">{t.contact.bodyLink}</a
		>{t.contact.bodyPost}
	</p>
</ChapterPage>
