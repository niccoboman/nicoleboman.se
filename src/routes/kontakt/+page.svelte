<script lang="ts">
	import ChapterPage from '$lib/components/ChapterPage.svelte';
</script>

<svelte:head>
	<title>Kontakt · Nicole Boman</title>
</svelte:head>

<ChapterPage
	number="05"
	title="Kontakt"
	prev={{ href: '/texter', label: 'Texter' }}
>
	<a href="mailto:info@nicoleboman.se" class="group inline-block">
		<span
			class="font-display text-[2rem] leading-tight text-ink transition-colors group-hover:text-clay md:text-[3rem]"
			style="font-variation-settings: 'opsz' 120, 'SOFT' 80, 'wght' 340;"
		>
			info@nicoleboman.se
		</span>
	</a>

	<div
		class="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[0.72rem] uppercase text-stone"
		style="letter-spacing: 0.22em;"
	>
		<a
			class="transition-colors hover:text-ink"
			href="https://www.linkedin.com/in/nicoleboman/"
			target="_blank"
			rel="noopener noreferrer">LinkedIn ↗</a
		>
		<a
			class="transition-colors hover:text-ink"
			href="https://bomannicole.substack.com/"
			target="_blank"
			rel="noopener noreferrer">Substack ↗</a
		>
		<a
			class="transition-colors hover:text-ink"
			href="https://studiosten.se"
			target="_blank"
			rel="noopener noreferrer">Studio Stén ↗</a
		>
	</div>

	<p class="mt-12 text-[1rem] leading-relaxed text-ink/75">
		För bokningar av föreläsningar, workshops eller konsultuppdrag — gå
		via
		<a
			class="text-clay underline decoration-line decoration-from-font underline-offset-4 transition hover:decoration-clay"
			href="https://studiosten.se"
			target="_blank"
			rel="noopener noreferrer">Studio Stén</a
		>. För allt annat är mejl snabbast.
	</p>
</ChapterPage>
