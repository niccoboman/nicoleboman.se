<script lang="ts">
	const innehall = [
		{ nr: '01', href: '/manifest', title: 'Manifest', blurb: 'Vad jag tror om AI och människa' },
		{ nr: '02', href: '/om-mig', title: 'Om mig', blurb: 'Bakgrund, roll och drivkraft' },
		{ nr: '03', href: '/arbete', title: 'Arbete', blurb: 'Föreläsning, utbildning, konsulting' },
		{ nr: '04', href: '/texter', title: 'Texter', blurb: 'Boundaries of Mind och andra essäer' },
		{ nr: '05', href: '/kontakt', title: 'Kontakt', blurb: 'Hör av dig' }
	];
</script>

<svelte:head>
	<title>Nicole Boman</title>
</svelte:head>

<!-- Hero -->
<section class="relative grid min-h-[88svh] grid-cols-12 items-end gap-x-6 pt-20 pb-16 md:pt-28">
	<div class="col-span-12 rise-in md:col-span-8" style="animation-delay: 0.1s;">
		<span
			class="font-display text-[0.98rem] italic text-stone"
			style="font-variation-settings: 'opsz' 14, 'SOFT' 80;"
		>
			Stockholm · våren 2026
		</span>
	</div>

	<h1
		class="col-span-12 mt-8 soften-in text-[18vw] leading-[0.86] tracking-[-0.035em] text-ink md:mt-10 md:text-[12.5vw]"
	>
		Nicole
		<span class="block pl-[0.12em]">Boman</span>
	</h1>

	<div class="col-span-12 mt-10 grid grid-cols-12 items-end gap-6 md:mt-14">
		<p
			class="col-span-12 rise-in font-display text-[1.4rem] leading-snug text-ink/85 md:col-span-7 md:text-[1.65rem]"
			style="font-variation-settings: 'opsz' 72, 'SOFT' 90, 'wght' 380; animation-delay: 0.9s;"
		>
			Översättare mellan teknik och människa. Jag hjälper organisationer
			förstå var AI faktiskt kan skapa värde — genom att börja med
			problemet, inte verktyget.
		</p>
		<div class="col-span-12 flex gap-6 text-[0.72rem] uppercase text-stone rise-in md:col-span-5 md:justify-end" style="letter-spacing: 0.22em; animation-delay: 1.2s;">
			<span>Föreläsare</span>
			<span class="text-line">/</span>
			<span>Utbildare</span>
			<span class="text-line">/</span>
			<span>Konsult</span>
		</div>
	</div>
</section>

<div class="rule my-16 md:my-24"></div>

<!-- Innehåll -->
<section class="grid grid-cols-12 gap-x-6 pb-16">
	<div class="col-span-12 md:col-span-3">
		<span class="text-[0.7rem] uppercase text-stone" style="letter-spacing: 0.28em;">
			Innehåll
		</span>
	</div>
	<div class="col-span-12 mt-6 flex flex-col divide-y divide-line md:col-span-9 md:mt-0">
		{#each innehall as item}
			<a
				href={item.href}
				class="group flex items-baseline gap-8 py-6 first:pt-0 transition-colors"
			>
				<span class="font-display text-sm text-stone" style="font-variation-settings: 'opsz' 14, 'wght' 500;">
					{item.nr}
				</span>
				<div class="flex-1">
					<h2
						class="font-display text-[1.6rem] leading-tight text-ink transition-colors group-hover:text-clay md:text-[1.9rem]"
						style="font-variation-settings: 'opsz' 72, 'SOFT' 70, 'wght' 400;"
					>
						{item.title}
					</h2>
					<p class="mt-1 text-[0.98rem] leading-relaxed text-ink/70">
						{item.blurb}
					</p>
				</div>
				<span class="shrink-0 text-stone transition-transform group-hover:translate-x-1">→</span>
			</a>
		{/each}
	</div>
</section>
