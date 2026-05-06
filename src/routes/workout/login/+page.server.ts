import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    if (!email || !password) {
      return fail(400, { error: 'Fyll i båda fälten.', email });
    }

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

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return fail(401, { error: 'Fel email eller lösenord.', email });
    }

    throw redirect(303, '/workout');
  }
};
