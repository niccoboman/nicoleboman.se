<script lang="ts">
	import ChapterPage from '$lib/components/ChapterPage.svelte';
</script>

<svelte:head>
	<title>Manifest · Nicole Boman</title>
</svelte:head>

<ChapterPage
	number="01"
	title="Manifest"
	next={{ href: '/om-mig', label: 'Om mig' }}
>
	<p
		class="font-display text-[1.9rem] leading-[1.22] text-ink md:text-[2.7rem]"
		style="font-variation-settings: 'opsz' 120, 'SOFT' 70, 'wght' 360;"
	>
		AI är inte trollkonst — det är språk, statistik och val, inslaget i
		teknik. Det som intresserar mig är inte teknikens framtid utan
		<em class="italic text-clay">människans</em>: vilka frågor vi vågar
		ställa, vem vi lyssnar på, och åt vem vi bygger.
	</p>
</ChapterPage>
