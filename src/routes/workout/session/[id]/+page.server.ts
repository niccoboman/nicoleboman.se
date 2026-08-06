import type { PageServerLoad, Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabase-server';
import {
  getSession,
  getSessionSets,
  upsertSet,
  finishSession,
  updateSessionNotes
} from '$lib/workout/sessions';
import { WORKOUTS } from '$lib/workout/plan';
import type { ExerciseKey } from '$lib/workout/types';

export const load: PageServerLoad = async ({ params, cookies, parent }) => {
  const { user } = await parent();
  if (!user) throw redirect(303, '/workout/login');

  const supabase = createSupabaseServerClient(cookies);
  const session = await getSession(supabase, params.id);

  if (!session) throw error(404, 'Pass hittades inte');
  if (session.user_id !== user.id) throw error(403, 'Inte ditt pass');

  const workout = WORKOUTS[session.workout_key];
  if (!workout) {
    console.error('Unknown workout_key on session', session.id, session.workout_key);
    throw error(500, 'Pass-konfiguration saknas');
  }

  const sets = await getSessionSets(supabase, session.id);

  return {
    session,
    workout,
    sets
  };
};

export const actions: Actions = {
  upsertSet: async ({ request, params, cookies }) => {
    const supabase = createSupabaseServerClient(cookies);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect(303, '/workout/login');

    const form = await request.formData();
    const exerciseKey = String(form.get('exercise_key'));
    const setNumber = Number(form.get('set_number'));
    const sideRaw = String(form.get('side') ?? '');
    const side = sideRaw === 'left' || sideRaw === 'right' ? sideRaw : null;
    const value = Number(form.get('value'));
    const weightRaw = String(form.get('weight_kg') ?? '');
    const weight_kg = weightRaw === '' ? null : Number(weightRaw);
    const rirRaw = String(form.get('rir') ?? '');
    const rir = rirRaw === '' ? null : Number(rirRaw);

    // Validera exercise_key mot kända övningar i alla pass
    const allExerciseKeys = new Set<string>(
      Object.values(WORKOUTS).flatMap((w) => w?.exercises.map((e) => e.key) ?? [])
    );
    if (!allExerciseKeys.has(exerciseKey)) {
      return { ok: false, error: 'Okänd övning' };
    }

    if (!Number.isInteger(setNumber) || setNumber < 1 || setNumber > 20) {
      return { ok: false, error: 'Ogiltigt set-nummer' };
    }
    if (!Number.isFinite(value) || value <= 0 || value > 600) {
      return { ok: false, error: 'Ogiltigt värde' };
    }
    if (weight_kg !== null && (!Number.isFinite(weight_kg) || weight_kg < 0 || weight_kg > 500)) {
      return { ok: false, error: 'Ogiltig vikt' };
    }
    if (rir !== null && (!Number.isInteger(rir) || rir < 0 || rir > 5)) {
      return { ok: false, error: 'Ogiltig RIR (0–5)' };
    }

    const updated = await upsertSet(supabase, {
      session_id: params.id,
      user_id: user.id,
      exercise_key: exerciseKey as ExerciseKey,
      set_number: setNumber,
      side,
      value,
      weight_kg,
      rir
    });

    return { ok: true, set: updated };
  },

  saveNotes: async ({ request, params, cookies }) => {
    const supabase = createSupabaseServerClient(cookies);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect(303, '/workout/login');

    const form = await request.formData();
    const notes = String(form.get('notes') ?? '');
    await updateSessionNotes(supabase, params.id, notes);
    return { ok: true };
  },

  finish: async ({ request, params, cookies }) => {
    const supabase = createSupabaseServerClient(cookies);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect(303, '/workout/login');

    const form = await request.formData();
    const notes = String(form.get('notes') ?? '');
    await finishSession(supabase, params.id, notes);
    throw redirect(303, '/workout');
  }
};
