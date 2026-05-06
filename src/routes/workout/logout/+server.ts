import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const POST: RequestHandler = async ({ cookies }) => {
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

  await supabase.auth.signOut();
  throw redirect(303, '/workout/login');
};
