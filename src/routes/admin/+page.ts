import { redirect } from '@sveltejs/kit';

// Min ateljé är ersatt av hubben.
export function load() {
	redirect(308, '/hub');
}
