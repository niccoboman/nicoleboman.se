<script lang="ts">
  import type { PlanExercise } from '$lib/workout/types';
  import type { SessionSetRow } from '$lib/workout/sessions';
  import SetRow from './SetRow.svelte';

  let {
    exercise,
    sets,
    onSetChange
  }: {
    exercise: PlanExercise;
    sets: SessionSetRow[];
    onSetChange: (input: {
      exerciseKey: string;
      setNumber: number;
      side: 'left' | 'right' | null;
      value: number | null;
      weight: number | null;
      rir: number | null;
    }) => void;
  } = $props();

  let sides = $derived(exercise.perSide ? (['left', 'right'] as const) : ([null] as const));

  function existingSet(setNumber: number, side: 'left' | 'right' | null): SessionSetRow | undefined {
    return sets.find(
      s => s.exercise_key === exercise.key &&
           s.set_number === setNumber &&
           s.side === side
    );
  }

  function isCompleted(setNumber: number, side: 'left' | 'right' | null): boolean {
    const s = existingSet(setNumber, side);
    if (!s) return false;
    if (exercise.targetWeightKg === null) return s.value > 0;
    return s.value > 0 && s.weight_kg !== null;
  }
</script>

<section class="bg-paper border border-line rounded-2xl p-4 space-y-3">
  <header>
    <h3 class="font-display text-lg font-medium">{exercise.name}</h3>
    <p class="text-sm text-stone">
      {exercise.targetSets} ×
      {#if exercise.targetMin === exercise.targetMax}{exercise.targetMin}{:else}{exercise.targetMin}–{exercise.targetMax}{/if}
      {exercise.unit === 'seconds' ? ' sek' : ''}
      @ {exercise.loadDescription}
      {#if exercise.amrap}<span class="text-stone italic"> · AMRAP</span>{/if}
    </p>
    <p class="text-sm text-stone italic mt-1">{exercise.cue}</p>
  </header>

  <div class="space-y-2">
    {#each Array(exercise.targetSets) as _, i}
      {#each sides as side}
        <SetRow
          {exercise}
          setNumber={i + 1}
          {side}
          initialValue={existingSet(i + 1, side)?.value ?? null}
          initialWeight={existingSet(i + 1, side)?.weight_kg ?? null}
          initialRir={existingSet(i + 1, side)?.rir ?? null}
          isCompleted={isCompleted(i + 1, side)}
          onChange={(data) =>
            onSetChange({
              exerciseKey: exercise.key,
              setNumber: i + 1,
              side,
              ...data
            })
          }
        />
      {/each}
    {/each}
  </div>
</section>
