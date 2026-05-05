import { test, expect, describe } from 'vitest';
import { WORKOUTS } from './plan';
import type { Workout } from './types';

describe('strength workouts', () => {
  const strengthKeys = ['strength_a', 'strength_b', 'strength_c'] as const;

  for (const key of strengthKeys) {
    describe(key, () => {
      const workout: Workout | undefined = WORKOUTS[key];

      test('exists', () => {
        expect(workout).toBeDefined();
      });

      test('has kind=strength', () => {
        expect(workout!.kind).toBe('strength');
      });

      test('has at least 5 exercises', () => {
        expect(workout!.exercises.length).toBeGreaterThanOrEqual(5);
      });

      test('every exercise has positive targetSets', () => {
        for (const ex of workout!.exercises) {
          expect(ex.targetSets, ex.name).toBeGreaterThan(0);
        }
      });

      test('every exercise has targetMin <= targetMax', () => {
        for (const ex of workout!.exercises) {
          expect(ex.targetMin, ex.name).toBeLessThanOrEqual(ex.targetMax);
        }
      });

      test('every exercise has restSeconds >= 30', () => {
        for (const ex of workout!.exercises) {
          expect(ex.restSeconds, ex.name).toBeGreaterThanOrEqual(30);
        }
      });

      test('every exercise has a non-empty cue', () => {
        for (const ex of workout!.exercises) {
          expect(ex.cue.length, ex.name).toBeGreaterThan(10);
        }
      });
    });
  }
});
