<script lang="ts">
	const innehall = [
		{ nr: '01', href: '/manifest', title: 'Manifest', blurb: 'Vad jag tror om AI och människa' },
		{ nr: '02', href: '/om-mig', title: 'Om mig', blurb: 'Bakgrund, roll och drivkraft' },
		{ nr: '03', href: '/arbete', title: 'Arbete', blurb: 'Föreläsning, utbildning, konsulting' },
		{ nr: '04', href: '/texter', title: 'Texter', blurb: 'Boundaries of Mind och andra essäer' },
		{ nr: '05', href: '/kontakt', title: 'Kontakt', blurb: 'Hör av dig' }
	];

	const roster = [
		{ num: 'i.', label: 'Föreläsare' },
		{ num: 'ii.', label: 'Utbildare' },
		{ num: 'iii.', label: 'Konsult' }
	];
</script>

<svelte:head>
	<title>Nicole Boman — Översättare mellan teknik och människa</title>
</svelte:head>

<!-- Hero -->
<section class="flex min-h-[82svh] flex-col justify-between pt-16 pb-12 md:pt-20 md:pb-16">
	<div class="rise-in" style="animation-delay: 0.1s;">
		<span
			class="font-display text-[0.95rem] italic text-stone"
			style="letter-spacing: 0.01em;"
		>
			Stockholm · våren 2026
		</span>
	</div>

	<h1
		class="font-display soften-in mt-10 text-[clamp(3rem,8.8vw,7.25rem)] leading-[0.96] tracking-[-0.015em] text-ink md:mt-14"
		style="font-weight: 450;"
	>
		<span class="block">Översättare</span>
		<span class="block italic" style="font-weight: 450;">mellan teknik</span>
		<span class="block">
			<span class="italic text-sage" style="font-size: 1.06em; line-height: 0.8; display: inline-block; transform: translateY(0.04em); margin-right: 0.08em;">&amp;</span>människa<span class="text-sage">.</span>
		</span>
	</h1>

	<div class="mt-14 grid grid-cols-12 items-end gap-6 md:mt-20">
		<p
			class="rise-in col-span-12 max-w-[32ch] text-[1.05rem] leading-[1.42] text-ink md:col-span-6 md:text-[1.2rem]"
			style="animation-delay: 0.9s; font-weight: 380;"
		>
			Jag hjälper organisationer förstå var <em class="font-display not-italic text-sage" style="font-weight: 500;">AI</em> faktiskt kan skapa värde — genom att börja med problemet, inte verktyget.
		</p>
		<div
			class="rise-in font-mono col-span-12 flex flex-col gap-2 text-[0.72rem] uppercase text-ink md:col-span-6 md:items-end"
			style="animation-delay: 1.1s; letter-spacing: 0.16em;"
		>
			{#each roster as role}
				<div class="flex items-baseline gap-3 md:gap-4">
					<span class="text-ink">{role.num}</span>
					<span class="text-line select-none">———</span>
					<span>{role.label}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<div class="rule my-10 md:my-16"></div>

<!-- Innehåll -->
<section class="grid grid-cols-12 gap-x-6 pb-8">
	<div class="col-span-12 md:col-span-3">
		<span class="font-mono text-[0.7rem] uppercase text-stone" style="letter-spacing: 0.18em;">
			Innehåll
		</span>
	</div>
	<div class="col-span-12 mt-6 flex flex-col divide-y divide-line md:col-span-9 md:mt-0">
		{#each innehall as item}
			<a
				href={item.href}
				class="group flex items-baseline gap-6 py-6 first:pt-0 md:gap-8"
			>
				<span class="font-mono text-[0.7rem] text-stone" style="letter-spacing: 0.14em;">
					{item.nr}
				</span>
				<div class="flex-1">
					<h2
						class="font-display text-[1.7rem] leading-tight text-ink transition-colors group-hover:text-sage group-hover:italic md:text-[2rem]"
						style="font-weight: 450;"
					>
						{item.title}
					</h2>
					<p class="mt-1 text-[0.98rem] leading-relaxed text-ink/70">
						{item.blurb}
					</p>
				</div>
				<span class="shrink-0 text-stone transition-transform group-hover:translate-x-1 group-hover:text-sage">→</span>
			</a>
		{/each}
	</div>
</section>
