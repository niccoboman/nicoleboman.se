import type { ParamMatcher } from '@sveltejs/kit';

// Svenska ligger under /sv, engelska är standard utan prefix.
export const match: ParamMatcher = (param) => param === 'sv';
