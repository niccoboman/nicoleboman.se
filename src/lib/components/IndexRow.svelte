<script lang="ts">
	interface Props {
		nr: string;
		title: string;
		desc?: string;
		meta?: string;
		href: string;
		external?: boolean;
	}
	let { nr, title, desc, meta, href, external = false }: Props = $props();
</script>

<a
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
	class="reveal group flex items-baseline gap-[clamp(16px,3vw,48px)] border-t border-hairline py-[clamp(14px,2.2vw,26px)] no-underline last:border-b"
>
	<span class="mono-label min-w-[2.4em] text-betong transition-colors group-hover:text-sienna">{nr}</span>
	<h2 class="font-display text-[clamp(1.9rem,5vw,4.4rem)] font-semibold uppercase leading-none tracking-[-0.02em] text-carbon transition-[color,transform] duration-300 group-hover:translate-x-[clamp(6px,1vw,16px)] md:text-betong md:group-hover:text-carbon">
		{title}
	</h2>
	{#if meta}
		<span class="mono-label ml-auto shrink-0 text-betong">{meta}</span>
	{:else if desc}
		<span class="ml-auto hidden max-w-[26ch] text-right text-[0.82rem] leading-[1.45] text-betong transition-colors group-hover:text-carbon/70 md:block">
			{desc}
		</span>
	{/if}
</a>
