import { redirect } from '@sveltejs/kit';

// Om-sidan är borttagen. Gamla länkar landar på om-avsnittet på startsidan.
export const load = ({ params }) => redirect(308, params.lang ? '/sv#om' : '/#om');
