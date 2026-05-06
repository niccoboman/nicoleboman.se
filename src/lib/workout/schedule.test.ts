import { test, expect, describe } from 'vitest';
import { weekdayFromDate, getPlannedWorkout } from './schedule';

describe('weekdayFromDate', () => {
  test('måndag 2026-05-04', () => {
    expect(weekdayFromDate(new Date('2026-05-04T10:00:00'))).toBe('monday');
  });
  test('tisdag 2026-05-05', () => {
    expect(weekdayFromDate(new Date('2026-05-05T10:00:00'))).toBe('tuesday');
  });
  test('söndag 2026-05-10', () => {
    expect(weekdayFromDate(new Date('2026-05-10T10:00:00'))).toBe('sunday');
  });
});

describe('getPlannedWorkout', () => {
  test('måndag → strength_a', () => {
    expect(getPlannedWorkout(new Date('2026-05-04T10:00:00'))).toBe('strength_a');
  });
  test('onsdag → strength_b', () => {
    expect(getPlannedWorkout(new Date('2026-05-06T10:00:00'))).toBe('strength_b');
  });
  test('fredag → strength_c', () => {
    expect(getPlannedWorkout(new Date('2026-05-08T10:00:00'))).toBe('strength_c');
  });
  test('söndag → null (vila)', () => {
    expect(getPlannedWorkout(new Date('2026-05-10T10:00:00'))).toBeNull();
  });
});
