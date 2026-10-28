import type { Handle } from '@sveltejs/kit';

// Sätter rätt språk på <html lang> beroende på adress: /sv... är svenska, allt annat engelska.
export const handle: Handle = ({ event, resolve }) => {
	const p = event.url.pathname;
	const lang = p === '/sv' || p.startsWith('/sv/') || p.startsWith('/hub') ? 'sv' : 'en';
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('<html lang="sv">', `<html lang="${lang}">`)
	});
};
