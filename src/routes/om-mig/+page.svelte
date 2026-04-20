<script lang="ts">
	import ChapterPage from '$lib/components/ChapterPage.svelte';

	const roller = ['Föreläsningar', 'Utbildningar', 'Konsulting', 'Skrivande', 'Paneler', 'Rådgivning'];
</script>

<svelte:head>
	<title>Om mig · Nicole Boman</title>
</svelte:head>

<ChapterPage
	number="02"
	title="Om mig"
	prev={{ href: '/manifest', label: 'Manifest' }}
	next={{ href: '/arbete', label: 'Arbete' }}
>
	<p
		class="font-display text-[1.6rem] leading-[1.25] text-ink md:text-[2.1rem]"
		style="font-variation-settings: 'opsz' 96, 'SOFT' 80, 'wght' 360;"
	>
		Jag är en översättare. Inte av språk utan av teknik — mellan det som
		maskinen <em class="italic">kan</em> och det som människan
		<em class="italic">behöver</em>.
	</p>

	<div class="mt-10 space-y-5 text-[1.02rem] leading-relaxed text-ink/80">
		<p>
			Till vardags AI-konsult, föreläsare och utbildare. Baserad i
			Stockholm, jobbar genom
			<a
				class="text-clay underline decoration-line decoration-from-font underline-offset-4 transition hover:decoration-clay"
				href="https://studiosten.se"
				target="_blank"
				rel="noopener noreferrer">Studio Stén</a
			>
			— där klientarbete och bokningar landar.
		</p>
		<p>
			Jag hjälper organisationer förstå var AI faktiskt kan skapa värde
			— genom workshops, keynotes och strategiskt arbete. Samarbetar
			bland annat med Bonnier Akademi kring kurser i generativ AI.
		</p>
		<p>
			Det som driver mig är mellanrummen. Mellan hype och avveckling.
			Mellan verktyg och mening. Mellan det tekniska som går att bevisa
			och det mänskliga som måste diskuteras.
		</p>
	</div>

	<div class="mt-10 grid grid-cols-2 gap-x-10 gap-y-3 md:grid-cols-3">
		{#each roller as item}
			<div class="flex items-center gap-3 text-[0.88rem] text-ink/75">
				<span class="h-px w-5 bg-line"></span>
				<span>{item}</span>
			</div>
		{/each}
	</div>
</ChapterPage>
