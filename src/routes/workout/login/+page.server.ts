import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createSupabaseServerClient } from '$lib/supabase-server';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    if (!email || !password) {
      return fail(400, { error: 'Fyll i båda fälten.', email });
    }

    const supabase = createSupabaseServerClient(cookies);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return fail(401, { error: 'Fel email eller lösenord.', email });
    }

    throw redirect(303, '/workout');
  }
};
