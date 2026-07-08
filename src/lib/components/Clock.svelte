<script lang="ts">
	let now = $state(new Date());

	$effect(() => {
		const id = setInterval(() => (now = new Date()), 30_000);
		return () => clearInterval(id);
	});

	const hhmm = $derived(
		now.toLocaleTimeString('sv-SE', {
			hour: '2-digit',
			minute: '2-digit',
			timeZone: 'Europe/Stockholm'
		})
	);
</script>

<span>{hhmm}</span>
