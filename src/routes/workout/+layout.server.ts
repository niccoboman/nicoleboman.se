import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/supabase-server';

export const load: LayoutServerLoad = async ({ url, cookies }) => {
  const supabase = createSupabaseServerClient(cookies);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && url.pathname !== '/workout/login') {
    throw redirect(303, '/workout/login');
  }

  if (user && url.pathname === '/workout/login') {
    throw redirect(303, '/workout');
  }

  return {
    user: user ? { id: user.id, email: user.email } : null
  };
};
