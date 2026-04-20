<script lang="ts">
	import ChapterPage from '$lib/components/ChapterPage.svelte';

	const texter = [
		{
			title: 'Time Out',
			year: '2025',
			href: 'https://bomannicole.substack.com/p/time-out'
		},
		{
			title: 'Defining Artificial Intelligence',
			year: '2025',
			href: 'https://bomannicole.substack.com/p/defining-artificial-intelligence'
		},
		{
			title: 'Is Marketing Ruining Art?',
			year: '2024',
			href: 'https://bomannicole.substack.com/p/is-marketing-ruining-art'
		}
	];
</script>

<svelte:head>
	<title>Texter · Nicole Boman</title>
</svelte:head>

<ChapterPage
	number="04"
	title="Texter"
	subtitle="Boundaries of Mind"
	prev={{ href: '/arbete', label: 'Arbete' }}
	next={{ href: '/kontakt', label: 'Kontakt' }}
>
	<div class="flex flex-col divide-y divide-line">
		{#each texter as text}
			<a
				class="group flex items-baseline justify-between gap-6 py-6 first:pt-0"
				href={text.href}
				target="_blank"
				rel="noopener noreferrer"
			>
				<h4
					class="font-display text-[1.55rem] leading-tight text-ink transition-colors group-hover:italic group-hover:text-sage md:text-[1.9rem]"
					style="font-weight: 450;"
				>
					{text.title}
				</h4>
				<div class="flex shrink-0 items-center gap-4">
					<span class="font-mono text-[0.7rem] uppercase text-stone" style="letter-spacing: 0.16em;">
						{text.year}
					</span>
					<span class="text-stone transition-transform group-hover:translate-x-1 group-hover:text-sage">→</span>
				</div>
			</a>
		{/each}
	</div>

	<div class="mt-10">
		<a
			href="https://bomannicole.substack.com/"
			target="_blank"
			rel="noopener noreferrer"
			class="group font-mono inline-flex items-center gap-3 text-[0.72rem] uppercase text-stone transition-colors hover:text-sage"
			style="letter-spacing: 0.16em;"
		>
			<span>Alla texter på Substack</span>
			<span class="inline-block transition-transform group-hover:translate-x-1">→</span>
		</a>
	</div>
</ChapterPage>
