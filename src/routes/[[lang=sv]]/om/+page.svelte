<script lang="ts">
	import { page } from '$app/state';
	import { reveal } from '$lib/reveal';
	import { text, sprakFran } from '$lib/i18n';

	const sprak = $derived(sprakFran(page.params.lang));
	const t = $derived(text[sprak].om);
</script>

<svelte:head>
	<title>{t.titel}</title>
	<link rel="alternate" hreflang="en" href="https://www.nicoleboman.com/om" />
	<link rel="alternate" hreflang="sv" href="https://www.nicoleboman.com/sv/om" />
</svelte:head>

<section class="px-[clamp(16px,3vw,40px)] pt-[16vh]">
	<p class="etikett">{t.etikett}</p>
	<h1 class="jatte mt-4 text-[clamp(4rem,12vw,13rem)] leading-[1]">{t.rubrik[0]}{' '}<br />{t.rubrik[1]}</h1>
</section>

<figure class="mt-[8vh]">
	<img
		src="/bilder/profil-1600.webp"
		srcset="/bilder/profil-900.webp 900w, /bilder/profil-1600.webp 1600w"
		sizes="100vw"
		alt={t.bildAlt}
		width="1600"
		height="1067"
		class="h-[min(80svh,60vw)] w-full object-cover object-[60%_40%] max-md:h-[60svh]"
	/>
</figure>

<ol class="mt-[12vh] border-t border-svart">
	{#each t.pastaenden as p, n (p.rubrik)}
		<li
			class="reveal grid gap-3 border-b border-svart px-[clamp(16px,3vw,40px)] py-8 md:grid-cols-12 md:items-baseline md:gap-8 md:py-10"
			use:reveal
		>
			<span class="etikett text-grafit md:col-span-1">0{n + 1}</span>
			<h2 class="jatte text-[clamp(2.2rem,3.8vw,4rem)] md:col-span-6">
				{#each p.rubrik.split(' ') as ordet, d (d)}{#if d > 0}{' '}{/if}<span class="whitespace-nowrap">{ordet}</span>{/each}
			</h2>
			<p class="max-w-[44ch] text-[1.1rem] leading-[1.55] md:col-span-5">{p.text}</p>
		</li>
	{/each}
</ol>

<section class="mt-[14vh] px-[clamp(16px,3vw,40px)]">
	<a
		href="#kontakt"
		class="jatte inline-block border-b-[6px] border-svart text-[clamp(2.2rem,4.5vw,4.5rem)] text-svart no-underline transition-transform hover:translate-x-2"
		>{t.cta}<span aria-hidden="true">&nbsp;→</span></a
	>
</section>
