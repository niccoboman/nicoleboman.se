import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseServerClient } from '$lib/supabase-server';

export const POST: RequestHandler = async ({ cookies }) => {
  const supabase = createSupabaseServerClient(cookies);
  const { error } = await supabase.auth.signOut();
  if (error) console.error('signOut failed', error);
  throw redirect(303, '/workout/login');
};
