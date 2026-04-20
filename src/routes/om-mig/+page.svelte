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
		class="font-display max-w-[42ch] text-[1.55rem] leading-[1.3] text-ink md:text-[1.95rem]"
		style="font-weight: 450;"
	>
		Jag är en <em class="italic text-sage">översättare</em>. Inte av språk utan av teknik — mellan det som
		maskinen <em class="italic">kan</em> och det som människan
		<em class="italic">behöver</em>.
	</p>

	<div class="mt-14 grid items-start gap-10 md:mt-16 md:grid-cols-12 md:gap-x-14">
		<!-- Body text -->
		<div class="order-2 space-y-5 text-[1.05rem] leading-relaxed text-ink/85 md:order-1 md:col-span-7">
			<p>
				Till vardags AI-konsult, föreläsare och utbildare. Baserad i
				Stockholm, jobbar genom
				<a
					class="text-sage underline decoration-line decoration-from-font underline-offset-4 transition hover:decoration-sage"
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

			<!-- Pull-quote anchor below body text -->
			<blockquote
				class="font-display mt-10 border-l border-line pl-5 text-[1.2rem] italic leading-snug text-ink/80 md:text-[1.35rem]"
				style="font-weight: 450;"
			>
				"Det tekniska går att bevisa. Det mänskliga måste diskuteras."
			</blockquote>
		</div>

		<!-- Portrait -->
		<figure class="order-1 md:order-2 md:col-span-4 md:col-start-9">
			<!-- När porträttet är klart: byt ut <div> nedan mot
			     <img src="/portrait.jpg" alt="Nicole Boman, Stockholm 2026" class="aspect-[4/5] w-full object-cover" /> -->
			<div
				class="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden border border-line bg-sand"
			>
				<div
					aria-hidden="true"
					class="absolute inset-0"
					style="background-image: radial-gradient(ellipse at 38% 32%, rgba(122, 139, 107, 0.2), transparent 60%), radial-gradient(ellipse at 72% 78%, rgba(122, 44, 44, 0.09), transparent 55%);"
				></div>
				<div class="relative flex flex-col items-center gap-2 text-center">
					<span class="font-display text-[1.1rem] italic text-stone">Porträtt</span>
					<span
						class="font-mono text-[0.6rem] uppercase text-stone/70"
						style="letter-spacing: 0.22em;">4:5 · placeholder</span
					>
				</div>
			</div>
			<figcaption class="font-display mt-3 text-[0.92rem] italic text-stone">
				Nicole, Stockholm · våren 2026.
			</figcaption>
		</figure>
	</div>

	<div
		class="font-mono mt-16 grid grid-cols-2 gap-x-10 gap-y-3 text-[0.78rem] uppercase md:grid-cols-3"
		style="letter-spacing: 0.14em;"
	>
		{#each roller as item, i}
			<div class="flex items-baseline gap-3 text-ink/80">
				<span class="text-stone">{String(i + 1).padStart(2, '0')}</span>
				<span class="h-px w-4 bg-line"></span>
				<span>{item}</span>
			</div>
		{/each}
	</div>
</ChapterPage>
