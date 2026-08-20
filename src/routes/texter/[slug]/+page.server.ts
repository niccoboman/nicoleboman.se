import { error } from '@sveltejs/kit';
import { hamtaText } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const text = hamtaText(params.slug);
	if (!text) error(404, 'Texten finns inte');
	return { text };
};
