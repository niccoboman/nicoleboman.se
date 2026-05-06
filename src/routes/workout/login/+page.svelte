<script lang="ts">
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
  <title>Workout — Logga in</title>
</svelte:head>

<div class="mx-auto max-w-sm py-20 px-6">
  <h1 class="font-display text-3xl font-medium tracking-tight text-ink mb-8">
    Workout
  </h1>

  <form method="POST" class="space-y-4">
    <label class="block">
      <span class="block text-sm text-stone mb-1">Email</span>
      <input
        type="email"
        name="email"
        required
        autocomplete="email"
        value={form?.email ?? ''}
        class="w-full bg-sand border border-line rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-stone"
      />
    </label>

    <label class="block">
      <span class="block text-sm text-stone mb-1">Lösenord</span>
      <input
        type="password"
        name="password"
        required
        autocomplete="current-password"
        class="w-full bg-sand border border-line rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-stone"
      />
    </label>

    {#if form?.error}
      <p class="text-sm text-wine" role="alert">{form.error}</p>
    {/if}

    <button
      type="submit"
      class="w-full bg-ink text-paper rounded-lg py-2.5 font-medium hover:opacity-90 transition"
    >
      Logga in
    </button>
  </form>
</div>
