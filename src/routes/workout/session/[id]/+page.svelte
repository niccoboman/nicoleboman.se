<script lang="ts">
  import type { PageData } from './$types';
  import ExerciseCard from './_components/ExerciseCard.svelte';
  import type { SessionSetRow } from '$lib/workout/sessions';

  let { data }: { data: PageData } = $props();

  // Lokal kopia av sets så vi kan uppdatera utan reload
  let sets = $state<SessionSetRow[]>(data.sets);
  let notes = $state<string>(data.session.notes ?? '');
  let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Räkna ut completion-progress
  let totalSetsPlanned = $derived(
    data.workout.exercises.reduce(
      (acc, ex) => acc + ex.targetSets * (ex.perSide ? 2 : 1),
      0
    )
  );
  let totalSetsDone = $derived(
    sets.filter(s => {
      const ex = data.workout.exercises.find(e => e.key === s.exercise_key);
      if (!ex) return false;
      if (ex.targetWeightKg === null) return s.value > 0;
      return s.value > 0 && s.weight_kg !== null;
    }).length
  );

  // Debounced upsert per (exercise_key, set_number, side)
  const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

  function debouncedUpsert(input: {
    exerciseKey: string;
    setNumber: number;
    side: 'left' | 'right' | null;
    value: number | null;
    weight: number | null;
    rir: number | null;
  }) {
    if (input.value === null) return;   // skippa tomma rader

    const dedupeKey = `${input.exerciseKey}:${input.setNumber}:${input.side ?? ''}`;
    const existing = debounceTimers.get(dedupeKey);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(() => {
      void doUpsert(input);
      debounceTimers.delete(dedupeKey);
    }, 500);

    debounceTimers.set(dedupeKey, timer);
  }

  async function doUpsert(input: {
    exerciseKey: string;
    setNumber: number;
    side: 'left' | 'right' | null;
    value: number | null;
    weight: number | null;
    rir: number | null;
  }) {
    saveStatus = 'saving';
    try {
      const formData = new FormData();
      formData.set('exercise_key', input.exerciseKey);
      formData.set('set_number', String(input.setNumber));
      if (input.side) formData.set('side', input.side);
      formData.set('value', String(input.value));
      formData.set('weight_kg', input.weight === null ? '' : String(input.weight));
      formData.set('rir', input.rir === null ? '' : String(input.rir));

      const res = await fetch('?/upsertSet', { method: 'POST', body: formData });
      const result = await res.json();
      if (result.type !== 'success') throw new Error('Save failed');

      const parsed = JSON.parse(result.data);
      const payload = parsed[0] as { ok: boolean; set?: SessionSetRow; error?: string } | undefined;
      if (!payload?.ok) throw new Error(payload?.error ?? 'Save rejected');

      const updated = payload.set;
      if (updated) {
        const idx = sets.findIndex(s => s.id === updated.id);
        if (idx >= 0) sets[idx] = updated;
        else sets = [...sets, updated];
      }
      saveStatus = 'saved';
      setTimeout(() => { if (saveStatus === 'saved') saveStatus = 'idle'; }, 1500);
    } catch (e) {
      console.error(e);
      saveStatus = 'error';
      setTimeout(() => { if (saveStatus === 'error') saveStatus = 'idle'; }, 4000);
    }
  }

  // Spara notes på input
  let notesTimer: ReturnType<typeof setTimeout> | null = null;
  function notesChanged() {
    if (notesTimer) clearTimeout(notesTimer);
    notesTimer = setTimeout(() => {
      const formData = new FormData();
      formData.set('notes', notes);
      void fetch('?/saveNotes', { method: 'POST', body: formData });
    }, 800);
  }
</script>

<svelte:head>
  <title>{data.workout.name} — Workout</title>
</svelte:head>

<main class="mx-auto max-w-md px-4 py-5 space-y-4 pb-32">
  <header class="space-y-1">
    <p class="text-xs uppercase tracking-mono text-stone">{data.workout.subtitle}</p>
    <h1 class="font-display text-2xl font-medium tracking-tight">{data.workout.name}</h1>
    <p class="text-sm text-stone">
      {totalSetsDone}/{totalSetsPlanned} set
      {#if saveStatus === 'saving'}<span class="ml-2 italic">sparar…</span>{/if}
      {#if saveStatus === 'saved'}<span class="ml-2 text-sage italic">sparat</span>{/if}
      {#if saveStatus === 'error'}<span class="ml-2 text-wine italic">kunde inte spara</span>{/if}
    </p>
  </header>

  {#each data.workout.exercises as exercise (exercise.key)}
    <ExerciseCard
      {exercise}
      {sets}
      onSetChange={debouncedUpsert}
    />
  {/each}

  <section class="bg-paper border border-line rounded-2xl p-4">
    <label class="block">
      <span class="block text-sm text-stone mb-2">Anteckning (frivillig)</span>
      <textarea
        bind:value={notes}
        oninput={notesChanged}
        rows="3"
        placeholder="Hur kändes det idag?"
        class="w-full bg-sand border border-line rounded-lg px-3 py-2 text-ink"
      ></textarea>
    </label>
  </section>

  <form method="POST" action="?/finish" class="sticky bottom-4">
    <input type="hidden" name="notes" value={notes} />
    <button
      type="submit"
      class="w-full bg-ink text-paper rounded-lg py-3.5 font-medium text-lg hover:opacity-90 transition shadow-lg"
    >
      Avsluta passet
    </button>
  </form>
</main>
