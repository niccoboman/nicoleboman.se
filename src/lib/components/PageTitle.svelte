<script lang="ts">
	interface Props {
		label: string;
		lines: readonly string[];
		punkt?: boolean;
	}
	let { label, lines, punkt = false }: Props = $props();

	const indents = ['', 'pl-[clamp(1rem,9vw,9rem)]', 'pl-[clamp(2rem,18vw,18rem)]'];
</script>

<div class="mono-label text-betong">{label}</div>
<h1 class="mt-[4vh] font-display text-[clamp(2.6rem,11.4vw,10.6rem)] font-semibold uppercase leading-[0.9] tracking-[-0.025em]">
	{#each lines as line, i}
		<span class="ln {indents[i] ?? ''}">
			<span>{line}{#if punkt && i === lines.length - 1}<span class="text-sienna">.</span>{/if}</span>
		</span>
	{/each}
</h1>
