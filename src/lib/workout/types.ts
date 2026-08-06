export type Weekday =
  | 'monday' | 'tuesday' | 'wednesday' | 'thursday'
  | 'friday' | 'saturday' | 'sunday';

export type WorkoutKind = 'strength' | 'cardio' | 'practice' | 'interval';

export type ExerciseUnit = 'reps' | 'seconds';

export type WorkoutKey =
  | 'strength_a'
  | 'strength_b'
  | 'strength_c'
  | 'cardio_z2'
  | 'active_recovery'
  | 'emom';

export type ExerciseKey =
  // Strength A
  | 'goblet_squat'
  | 'push_up'
  | 'kb_press_half_kneeling'
  | 'double_kb_rdl'
  | 'kb_row_supported'
  | 'ytw_raises'
  | 'hollow_body_hold'
  // Strength B
  | 'kb_swing'
  | 'bulgarian_split_squat'
  | 'kb_floor_press'
  | 'kb_halo'
  | 'farmers_carry'
  | 'dead_bug'
  // Strength C
  | 'kb_clean'
  | 'reverse_lunge'
  | 'push_up_controlled'
  | 'single_leg_rdl'
  | 'side_plank'
  | 'suitcase_carry';

export interface PlanExercise {
  key: ExerciseKey;
  name: string;
  unit: ExerciseUnit;
  targetSets: number;
  targetMin: number;
  targetMax: number;
  amrap?: boolean;
  targetWeightKg: number | null;
  loadDescription: string;
  cue: string;
  restSeconds: number;
  perSide?: boolean;
}

export interface Workout {
  key: WorkoutKey;
  kind: WorkoutKind;
  name: string;
  subtitle: string;
  durationMinutes: string;
  exercises: PlanExercise[];
  cardioOptions?: string[];
}
