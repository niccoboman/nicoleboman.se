import type { SupabaseClient } from '@supabase/supabase-js';
import type { ExerciseKey, WorkoutKey } from './types';

export interface SessionRow {
  id: string;
  user_id: string;
  workout_key: WorkoutKey;
  planned_key: WorkoutKey;
  started_at: string;
  completed_at: string | null;
  notes: string | null;
  duration_min: number | null;
  activity_type: string | null;
  created_at: string;
}

export interface SessionSetRow {
  id: string;
  session_id: string;
  user_id: string;
  exercise_key: ExerciseKey;
  set_number: number;
  side: 'left' | 'right' | null;
  value: number;
  weight_kg: number | null;
  rir: number | null;
  logged_at: string;
}

export interface SetUpsertInput {
  session_id: string;
  user_id: string;
  exercise_key: ExerciseKey;
  set_number: number;
  side: 'left' | 'right' | null;
  value: number;
  weight_kg: number | null;
  rir: number | null;
}

export async function createSession(
  client: SupabaseClient,
  userId: string,
  workoutKey: WorkoutKey,
  plannedKey: WorkoutKey
): Promise<SessionRow> {
  const { data, error } = await client
    .from('sessions')
    .insert({
      user_id: userId,
      workout_key: workoutKey,
      planned_key: plannedKey
    })
    .select()
    .single();
  if (error) throw error;
  return data as SessionRow;
}

export async function getActiveSession(
  client: SupabaseClient,
  userId: string
): Promise<SessionRow | null> {
  const { data, error } = await client
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .is('completed_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as SessionRow) ?? null;
}

export async function getSession(
  client: SupabaseClient,
  sessionId: string
): Promise<SessionRow | null> {
  const { data, error } = await client
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .maybeSingle();
  if (error) throw error;
  return (data as SessionRow) ?? null;
}

export async function getSessionSets(
  client: SupabaseClient,
  sessionId: string
): Promise<SessionSetRow[]> {
  const { data, error } = await client
    .from('session_sets')
    .select('*')
    .eq('session_id', sessionId)
    .order('set_number', { ascending: true });
  if (error) throw error;
  return (data as SessionSetRow[]) ?? [];
}

export async function upsertSet(
  client: SupabaseClient,
  input: SetUpsertInput
): Promise<SessionSetRow> {
  // Vi använder unique-key (session_id, exercise_key, set_number, side)
  // för dedup. Eftersom vi inte har en unique constraint i DB för det,
  // gör vi en manuell select-then-update-or-insert.
  const { data: existing } = await client
    .from('session_sets')
    .select('id')
    .eq('session_id', input.session_id)
    .eq('exercise_key', input.exercise_key)
    .eq('set_number', input.set_number)
    .is('side', input.side)   // null-safe equality
    .maybeSingle();

  if (existing) {
    const { data, error } = await client
      .from('session_sets')
      .update({
        value: input.value,
        weight_kg: input.weight_kg,
        rir: input.rir,
        logged_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data as SessionSetRow;
  }

  const { data, error } = await client
    .from('session_sets')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as SessionSetRow;
}

export async function deleteSet(
  client: SupabaseClient,
  setId: string
): Promise<void> {
  const { error } = await client
    .from('session_sets')
    .delete()
    .eq('id', setId);
  if (error) throw error;
}

export async function finishSession(
  client: SupabaseClient,
  sessionId: string,
  notes: string | null
): Promise<void> {
  const { error } = await client
    .from('sessions')
    .update({
      completed_at: new Date().toISOString(),
      notes: notes && notes.trim().length > 0 ? notes : null
    })
    .eq('id', sessionId);
  if (error) throw error;
}

export async function updateSessionNotes(
  client: SupabaseClient,
  sessionId: string,
  notes: string | null
): Promise<void> {
  const { error } = await client
    .from('sessions')
    .update({ notes: notes && notes.trim().length > 0 ? notes : null })
    .eq('id', sessionId);
  if (error) throw error;
}
