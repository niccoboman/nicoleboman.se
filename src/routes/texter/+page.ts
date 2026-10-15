import { redirect } from '@sveltejs/kit';

// Gammal svensk adress – pekar nu på den svenska versionen.
export const load = () => redirect(308, '/sv');
