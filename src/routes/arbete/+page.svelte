<script lang="ts">
	import ChapterPage from '$lib/components/ChapterPage.svelte';

	const arbete = [
		{
			label: 'Föreläsning',
			desc: 'Keynotes om AI — för ledning, bransch och institutioner.'
		},
		{
			label: 'Utbildning',
			desc: 'Praktiska workshops som gör teknik användbar i vardagen.'
		},
		{
			label: 'Konsulting',
			desc: 'Strategiskt arbete där AI möter verksamhet och människor.'
		}
	];
</script>

<svelte:head>
	<title>Arbete · Nicole Boman</title>
</svelte:head>

<ChapterPage
	number="03"
	title="Arbete"
	prev={{ href: '/om-mig', label: 'Om mig' }}
	next={{ href: '/texter', label: 'Texter' }}
>
	<div class="flex flex-col divide-y divide-line">
		{#each arbete as item, i}
			<div class="group flex items-baseline gap-8 py-7 first:pt-0">
				<span
					class="font-display text-sm text-stone"
					style="font-variation-settings: 'opsz' 14, 'wght' 500;"
				>
					{String(i + 1).padStart(2, '0')}
				</span>
				<div class="flex-1">
					<h3
						class="font-display text-[1.7rem] leading-tight text-ink md:text-[2rem]"
						style="font-variation-settings: 'opsz' 72, 'SOFT' 70, 'wght' 400;"
					>
						{item.label}
					</h3>
					<p class="mt-2 max-w-xl text-[1rem] leading-relaxed text-ink/75">
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
			class="group inline-flex items-center gap-3 text-[0.72rem] uppercase text-stone transition-colors hover:text-clay"
			style="letter-spacing: 0.22em;"
		>
			<span>För bokning — Studio Stén</span>
			<span class="inline-block transition-transform group-hover:translate-x-1">→</span>
		</a>
	</div>
</ChapterPage>
