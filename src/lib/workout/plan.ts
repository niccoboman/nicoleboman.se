import type { PlanExercise, Weekday, Workout, WorkoutKey } from './types';

const STRENGTH_A: Workout = {
  key: 'strength_a',
  kind: 'strength',
  name: 'Strength A',
  subtitle: 'Squat & Push',
  durationMinutes: '45–55',
  exercises: [
    {
      key: 'goblet_squat',
      name: 'Goblet squat',
      unit: 'reps',
      targetSets: 4,
      targetMin: 8,
      targetMax: 10,
      targetWeightKg: 12,
      loadDescription: '12 kg KB',
      cue: 'Tempo 3-1-1. Tre sekunder ner, ett-sekunds paus, kör upp.',
      restSeconds: 90
    },
    {
      key: 'push_up',
      name: 'Push-up',
      unit: 'reps',
      targetSets: 3,
      targetMin: 1,
      targetMax: 99,
      amrap: true,
      targetWeightKg: null,
      loadDescription: 'Bodyweight',
      cue: 'Stop 1–2 reps short of failure. Höj fötter på stol när lätt.',
      restSeconds: 90
    },
    {
      key: 'kb_press_half_kneeling',
      name: 'Single-arm KB press',
      unit: 'reps',
      targetSets: 3,
      targetMin: 6,
      targetMax: 8,
      targetWeightKg: 8,
      loadDescription: '8 kg KB',
      cue: 'Half-kneeling. Revben ner, glutes squeezed.',
      restSeconds: 75,
      perSide: true
    },
    {
      key: 'double_kb_rdl',
      name: 'Double KB Romanian deadlift',
      unit: 'reps',
      targetSets: 4,
      targetMin: 8,
      targetMax: 10,
      targetWeightKg: 12,
      loadDescription: '2× 12 kg KB',
      cue: 'Höfter bak, mjuka knän. Känn hamstrings stretcha.',
      restSeconds: 90
    },
    {
      key: 'kb_row_supported',
      name: 'Single-arm KB row',
      unit: 'reps',
      targetSets: 3,
      targetMin: 8,
      targetMax: 8,
      targetWeightKg: 12,
      loadDescription: '12 kg KB',
      cue: 'Fri hand på stol. Dra armbåge till höft, paus 1 sek överst.',
      restSeconds: 75,
      perSide: true
    },
    {
      key: 'ytw_raises',
      name: 'Prone Y-T-W raises',
      unit: 'reps',
      targetSets: 3,
      targetMin: 8,
      targetMax: 8,
      targetWeightKg: 2,
      loadDescription: '2× 1–2 kg DB',
      cue: 'Liggande på mage. Långsamt, kontrollerat. Squeeze övre rygg, inte nacke.',
      restSeconds: 60
    },
    {
      key: 'hollow_body_hold',
      name: 'Hollow body hold',
      unit: 'seconds',
      targetSets: 3,
      targetMin: 20,
      targetMax: 40,
      targetWeightKg: null,
      loadDescription: 'Bodyweight',
      cue: 'Nedre rygg pressad mot golvet. Korta lever om den lyfts.',
      restSeconds: 60
    }
  ]
};

const STRENGTH_B: Workout = {
  key: 'strength_b',
  kind: 'strength',
  name: 'Strength B',
  subtitle: 'Hinge & Pull',
  durationMinutes: '45–55',
  exercises: [
    {
      key: 'kb_swing',
      name: 'KB swing',
      unit: 'reps',
      targetSets: 5,
      targetMin: 12,
      targetMax: 12,
      targetWeightKg: 12,
      loadDescription: '12 kg KB',
      cue: 'Hinge, inte squat. Snäpp höfterna. KB flyter till brösthöjd.',
      restSeconds: 90
    },
    {
      key: 'bulgarian_split_squat',
      name: 'Bulgarian split squat',
      unit: 'reps',
      targetSets: 3,
      targetMin: 8,
      targetMax: 8,
      targetWeightKg: 8,
      loadDescription: '8 kg goblet',
      cue: 'Tempo 3-1-1. Bakfot på stol. Fram-skenben nästan vertikalt.',
      restSeconds: 90,
      perSide: true
    },
    {
      key: 'kb_row_supported',
      name: 'Single-arm KB row',
      unit: 'reps',
      targetSets: 4,
      targetMin: 8,
      targetMax: 8,
      targetWeightKg: 12,
      loadDescription: '12 kg KB',
      cue: 'Hand på stol för stöd. Dra armbåge till höft, paus 1 sek.',
      restSeconds: 75,
      perSide: true
    },
    {
      key: 'kb_floor_press',
      name: 'KB floor press',
      unit: 'reps',
      targetSets: 3,
      targetMin: 10,
      targetMax: 10,
      targetWeightKg: 8,
      loadDescription: '8 kg KB',
      cue: 'Långsam kontroll. Triceps tar i golvet innan du pressar upp.',
      restSeconds: 75,
      perSide: true
    },
    {
      key: 'kb_halo',
      name: 'KB halo',
      unit: 'reps',
      targetSets: 3,
      targetMin: 5,
      targetMax: 5,
      targetWeightKg: 8,
      loadDescription: '8 kg KB',
      cue: 'Tight cirkel runt huvudet. Bracha core — låt inte ryggen svaja.',
      restSeconds: 60
    },
    {
      key: 'farmers_carry',
      name: "Farmer's carry",
      unit: 'seconds',
      targetSets: 3,
      targetMin: 30,
      targetMax: 30,
      targetWeightKg: 12,
      loadDescription: '2× 12 kg KB',
      cue: 'Lång hållning. Axlar ner och bak. Gå långsamt.',
      restSeconds: 75
    },
    {
      key: 'dead_bug',
      name: 'Dead bug',
      unit: 'reps',
      targetSets: 3,
      targetMin: 8,
      targetMax: 8,
      targetWeightKg: null,
      loadDescription: 'Bodyweight',
      cue: 'Nedre rygg platt mot golvet. Rör motsatt arm och ben långsamt.',
      restSeconds: 60,
      perSide: true
    }
  ]
};

const STRENGTH_C: Workout = {
  key: 'strength_c',
  kind: 'strength',
  name: 'Strength C',
  subtitle: 'Power & Unilateral',
  durationMinutes: '45–55',
  exercises: [
    {
      key: 'kb_clean',
      name: 'KB clean',
      unit: 'reps',
      targetSets: 4,
      targetMin: 5,
      targetMax: 5,
      targetWeightKg: 12,
      loadDescription: '8–12 kg KB',
      cue: 'Hike mellan benen, snäpp höfter, fånga i front rack. Curla inte.',
      restSeconds: 90,
      perSide: true
    },
    {
      key: 'reverse_lunge',
      name: 'Reverse lunge',
      unit: 'reps',
      targetSets: 3,
      targetMin: 8,
      targetMax: 8,
      targetWeightKg: 8,
      loadDescription: '8 kg goblet',
      cue: 'Steg bak, sänk knät mjukt, kör genom främre häl. Tempo 3-1-1.',
      restSeconds: 90,
      perSide: true
    },
    {
      key: 'push_up_controlled',
      name: 'Push-up (controlled)',
      unit: 'reps',
      targetSets: 3,
      targetMin: 8,
      targetMax: 12,
      targetWeightKg: null,
      loadDescription: 'Bodyweight',
      cue: 'Långsam 3-sekunders sänkning. Höj fötter på stol när lätt.',
      restSeconds: 75
    },
    {
      key: 'single_leg_rdl',
      name: 'Single-leg Romanian deadlift',
      unit: 'reps',
      targetSets: 3,
      targetMin: 8,
      targetMax: 8,
      targetWeightKg: 12,
      loadDescription: '12 kg KB',
      cue: 'Fri hand sträcker fram när KB-sidans ben lyfts bak. Långsamt.',
      restSeconds: 90,
      perSide: true
    },
    {
      key: 'kb_row_supported',
      name: 'Single-arm KB row',
      unit: 'reps',
      targetSets: 3,
      targetMin: 10,
      targetMax: 10,
      targetWeightKg: 12,
      loadDescription: '12 kg KB',
      cue: 'Samma som onsdag. Att förstärka mönstret är poängen.',
      restSeconds: 75,
      perSide: true
    },
    {
      key: 'side_plank',
      name: 'Side plank',
      unit: 'seconds',
      targetSets: 3,
      targetMin: 30,
      targetMax: 30,
      targetWeightKg: null,
      loadDescription: 'Bodyweight',
      cue: 'Stacka höfterna. Låt dem inte droppa. Andas.',
      restSeconds: 60,
      perSide: true
    },
    {
      key: 'suitcase_carry',
      name: 'Suitcase carry',
      unit: 'seconds',
      targetSets: 3,
      targetMin: 30,
      targetMax: 30,
      targetWeightKg: 12,
      loadDescription: '12 kg KB',
      cue: 'En sida — anti-lateral-flexion. Låt inte den lastade sidan dra dig ner.',
      restSeconds: 75,
      perSide: true
    }
  ]
};

export const WORKOUTS: Partial<Record<WorkoutKey, Workout>> = {
  strength_a: STRENGTH_A,
  strength_b: STRENGTH_B,
  strength_c: STRENGTH_C
  // cardio_z2, active_recovery, emom kommer i fas 4-plan
};

export const WEEKLY_SCHEDULE: Record<Weekday, WorkoutKey | null> = {
  monday: 'strength_a',
  tuesday: 'cardio_z2',
  wednesday: 'strength_b',
  thursday: 'active_recovery',
  friday: 'strength_c',
  saturday: 'emom',
  sunday: null
};
