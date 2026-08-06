import type { Weekday, WorkoutKey } from './types';
import { WEEKLY_SCHEDULE } from './plan';

const WEEKDAYS: Weekday[] = [
  'sunday', 'monday', 'tuesday', 'wednesday',
  'thursday', 'friday', 'saturday'
];

export function weekdayFromDate(date: Date): Weekday {
  return WEEKDAYS[date.getDay()];
}

export function getPlannedWorkout(date: Date): WorkoutKey | null {
  return WEEKLY_SCHEDULE[weekdayFromDate(date)];
}
