import { allaTexter } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return { texter: allaTexter() };
};
