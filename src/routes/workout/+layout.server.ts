import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load: LayoutServerLoad = async ({ url, cookies }) => {
  const supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookies.getAll(),
        setAll: (toSet) => {
          for (const { name, value, options } of toSet) {
            cookies.set(name, value, { ...options, path: '/' });
          }
        }
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Tillåt /workout/login utan auth
  if (!user && !url.pathname.startsWith('/workout/login')) {
    throw redirect(303, '/workout/login');
  }

  // Om inloggad och försöker nå login → till startskärm
  if (user && url.pathname.startsWith('/workout/login')) {
    throw redirect(303, '/workout');
  }

  return {
    user: user ? { id: user.id, email: user.email } : null
  };
};
