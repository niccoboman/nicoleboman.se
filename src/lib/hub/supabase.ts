import { env } from '$env/dynamic/public';
import { createClient } from '@supabase/supabase-js';

const url = env.PUBLIC_SUPABASE_URL;
const anonKey = env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = url && anonKey
	? createClient(url, anonKey, {
			auth: {
				persistSession: true,
				autoRefreshToken: true,
				detectSessionInUrl: true
			}
		})
	: null;
