<script lang="ts">
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';
	import { reveal } from '$lib/reveal';
	import PageTitle from '$lib/components/PageTitle.svelte';

	const t = $derived(translations[ui.lang]);
</script>

<svelte:head>
	<title>{t.nav.contact} · Nicole Boman</title>
</svelte:head>

<article class="pb-[10vh] pt-[6vh] md:pb-[16vh] md:pt-[10vh]">
	<PageTitle label={t.contact.label} lines={t.contact.titleLines} punkt />

	<div class="mt-[8vh] md:mt-[12vh]" use:reveal>
		<p class="reveal max-w-[42ch] text-[1.05rem] leading-[1.6] text-carbon/80">{t.contact.body}</p>
		<dl class="reveal mt-[8vh] flex max-w-[560px] flex-col">
			{#each t.contact.channels as channel}
				<div class="flex items-baseline justify-between gap-6 border-t border-hairline py-4 last:border-b">
					<dt class="mono-label text-betong">{channel.label}</dt>
					<dd>
						<a
							href={channel.href}
							target={channel.href.startsWith('mailto:') ? undefined : '_blank'}
							rel={channel.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
							class="text-[0.95rem] text-carbon no-underline transition-colors hover:text-sienna"
						>
							{channel.value}
						</a>
					</dd>
				</div>
			{/each}
		</dl>
	</div>
</article>
