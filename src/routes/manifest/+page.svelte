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
		class="font-display text-[1.75rem] leading-[1.24] text-ink md:text-[2.4rem]"
		style="font-weight: 450;"
	>
		<em class="italic">AI är inte trollkonst</em> — det är språk, statistik och val, inslaget i teknik. Det som intresserar mig är inte teknikens framtid utan
		<em class="italic text-sage">människans</em>: vilka frågor vi vågar
		ställa, vem vi lyssnar på, och åt vem vi bygger.
	</p>
</ChapterPage>
