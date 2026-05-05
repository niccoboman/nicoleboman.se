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
      name: 'Single-arm KB row (supported)',
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

export const WORKOUTS: Record<WorkoutKey, Workout> = {
  strength_a: STRENGTH_A,
  // strength_b, strength_c, cardio_z2, active_recovery, emom: kommer i senare tasks
} as Record<WorkoutKey, Workout>;

export const WEEKLY_SCHEDULE: Record<Weekday, WorkoutKey | null> = {
  monday: 'strength_a',
  tuesday: 'cardio_z2',
  wednesday: 'strength_b',
  thursday: 'active_recovery',
  friday: 'strength_c',
  saturday: 'emom',
  sunday: null
};
