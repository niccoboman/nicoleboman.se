<script lang="ts">
  import type { PageData } from './$types';
  import { enhance } from '$app/forms';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Workout</title>
</svelte:head>

<main class="mx-auto max-w-md px-4 py-6 space-y-8">
  {#if data.activeSession}
    <section class="bg-sand border border-line rounded-2xl p-5">
      <p class="text-sm text-stone mb-1">Pågående pass</p>
      <h2 class="font-display text-2xl font-medium mb-3">
        Du har ett pass igång
      </h2>
      <a
        href="/workout/session/{data.activeSession.id}"
        class="inline-block bg-ink text-paper rounded-lg px-5 py-2.5 font-medium hover:opacity-90 transition"
      >
        Fortsätt passet
      </a>
    </section>
  {:else if data.planned}
    <section>
      <p class="text-sm text-stone mb-1">Idag</p>
      <h2 class="font-display text-3xl font-medium tracking-tight mb-1">
        {data.planned.name}
      </h2>
      <p class="text-stone italic mb-5">{data.planned.subtitle}</p>

      <form method="POST" action="?/start" use:enhance>
        <input type="hidden" name="workout_key" value={data.planned.key} />
        <input type="hidden" name="planned_key" value={data.planned.key} />
        <button
          type="submit"
          class="w-full bg-ink text-paper rounded-lg py-3 font-medium text-lg hover:opacity-90 transition"
        >
          Starta passet
        </button>
      </form>
    </section>
  {:else}
    <section>
      <p class="text-sm text-stone mb-1">Idag</p>
      <h2 class="font-display text-2xl font-medium tracking-tight mb-3">
        Vilodag
      </h2>
      <p class="text-stone">Planen säger vila idag. Välj ändå ett pass nedan om du vill köra.</p>
    </section>
  {/if}

  <section>
    <h3 class="text-sm uppercase tracking-mono text-stone mb-3">Andra pass</h3>
    <div class="space-y-2">
      {#each data.allWorkouts.filter(w => w.key !== data.planned?.key) as workout (workout.key)}
        <form method="POST" action="?/start" use:enhance>
          <input type="hidden" name="workout_key" value={workout.key} />
          {#if data.planned}
            <input type="hidden" name="planned_key" value={data.planned.key} />
          {/if}
          <button
            type="submit"
            class="w-full text-left bg-paper border border-line rounded-lg px-4 py-3 hover:bg-sand transition"
          >
            <span class="font-medium">{workout.name}</span>
            <span class="text-stone italic"> — {workout.subtitle}</span>
          </button>
        </form>
      {/each}
    </div>
  </section>
</main>
