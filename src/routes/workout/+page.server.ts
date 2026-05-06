import type { PageServerLoad, Actions } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { getActiveSession, createSession } from '$lib/workout/sessions';
import { getPlannedWorkout } from '$lib/workout/schedule';
import { WORKOUTS } from '$lib/workout/plan';
import type { WorkoutKey } from '$lib/workout/types';
import { error, redirect } from '@sveltejs/kit';

function makeServerClient(cookies: any) {
  return createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookies.getAll(),
        setAll: (toSet: any[]) => {
          for (const { name, value, options } of toSet) {
            cookies.set(name, value, { ...options, path: '/' });
          }
        }
      }
    }
  );
}

export const load: PageServerLoad = async ({ cookies, parent }) => {
  const { user } = await parent();
  if (!user) throw redirect(303, '/workout/login');

  const supabase = makeServerClient(cookies);
  const active = await getActiveSession(supabase, user.id);

  const plannedKey = getPlannedWorkout(new Date());
  const planned = plannedKey ? (WORKOUTS[plannedKey] ?? null) : null;

  // Lista alla strength-pass som overrides
  const allWorkouts = Object.values(WORKOUTS).filter(w => w.kind === 'strength');

  return {
    activeSession: active,
    plannedKey,
    planned: planned ? { key: planned.key, name: planned.name, subtitle: planned.subtitle } : null,
    allWorkouts: allWorkouts.map(w => ({ key: w.key, name: w.name, subtitle: w.subtitle }))
  };
};

export const actions: Actions = {
  start: async ({ request, cookies }) => {
    const supabase = makeServerClient(cookies);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect(303, '/workout/login');

    const formData = await request.formData();
    const workoutKey = formData.get('workout_key');
    const plannedKeyForm = formData.get('planned_key') ?? workoutKey;

    if (typeof workoutKey !== 'string' || !Object.hasOwn(WORKOUTS, workoutKey)) {
      throw error(400, 'Okänt pass');
    }
    if (typeof plannedKeyForm !== 'string' || !Object.hasOwn(WORKOUTS, plannedKeyForm)) {
      throw error(400, 'Okänt planerat pass');
    }

    const session = await createSession(
      supabase,
      user.id,
      workoutKey as WorkoutKey,
      plannedKeyForm as WorkoutKey
    );

    throw redirect(303, `/workout/session/${session.id}`);
  }
};
