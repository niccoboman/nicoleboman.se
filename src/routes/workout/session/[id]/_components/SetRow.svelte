<script lang="ts">
  import type { PlanExercise } from '$lib/workout/types';

  let {
    exercise,
    setNumber,
    side,
    initialValue,
    initialWeight,
    initialRir,
    isCompleted,
    onChange
  }: {
    exercise: PlanExercise;
    setNumber: number;
    side: 'left' | 'right' | null;
    initialValue: number | null;
    initialWeight: number | null;
    initialRir: number | null;
    isCompleted: boolean;
    onChange: (data: {
      value: number | null;
      weight: number | null;
      rir: number | null;
    }) => void;
  } = $props();

  // initialValue/initialWeight/initialRir captured at mount; parent must remount via {#key} to reset
  let valueInput = $state<string>(initialValue?.toString() ?? '');
  let weightInput = $state<string>(initialWeight?.toString() ?? '');
  let rirInput = $state<string>(initialRir?.toString() ?? '');

  let valueLabel = $derived(exercise.unit === 'seconds' ? 'sek' : 'reps');
  let isBodyweight = $derived(exercise.targetWeightKg === null);

  function emit() {
    const v = valueInput.trim() === '' ? null : Number(valueInput);
    const w = weightInput.trim() === '' ? null : Number(weightInput);
    const r = rirInput.trim() === '' ? null : Number(rirInput);
    onChange({
      value: Number.isFinite(v as number) ? (v as number) : null,
      weight: Number.isFinite(w as number) ? (w as number) : null,
      rir: Number.isFinite(r as number) ? (r as number) : null
    });
  }
</script>

<div
  class="grid grid-cols-[3rem_1fr_1fr_3.5rem] gap-2 items-center px-2 py-2 rounded-md border"
  class:border-sage={isCompleted}
  class:bg-sand={isCompleted}
  class:border-line={!isCompleted}
>
  <span class="text-sm text-stone">
    {setNumber}{#if side}{side === 'left' ? ' V' : ' H'}{/if}
  </span>

  <label class="block">
    <input
      type="number"
      inputmode="numeric"
      placeholder={`${exercise.targetMin}${exercise.targetMin !== exercise.targetMax ? `-${exercise.targetMax}` : ''}`}
      bind:value={valueInput}
      onblur={emit}
      class="w-full bg-paper border border-line rounded px-2 py-1.5 text-center"
    />
    <span class="block text-xs text-stone text-center mt-0.5">{valueLabel}</span>
  </label>

  <label class="block">
    {#if isBodyweight}
      <span class="block text-center text-stone text-sm py-1.5">—</span>
      <span class="block text-xs text-stone text-center mt-0.5">bodyweight</span>
    {:else}
      <input
        type="number"
        step="0.5"
        inputmode="decimal"
        placeholder={exercise.targetWeightKg?.toString() ?? ''}
        bind:value={weightInput}
        onchange={emit}
        onblur={emit}
        class="w-full bg-paper border border-line rounded px-2 py-1.5 text-center"
      />
      <span class="block text-xs text-stone text-center mt-0.5">kg</span>
    {/if}
  </label>

  <label class="block">
    <input
      type="number"
      min="0"
      max="5"
      inputmode="numeric"
      placeholder="RIR"
      bind:value={rirInput}
      onblur={emit}
      class="w-full bg-paper border border-line rounded px-2 py-1.5 text-center"
    />
    <span class="block text-xs text-stone text-center mt-0.5">RIR</span>
  </label>
</div>
