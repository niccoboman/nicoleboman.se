import { marked } from 'marked';

export interface TextMeta {
	slug: string;
	titel: string;
	datum: string; // YYYY-MM-DD
	ar: string;
	sprak: 'sv' | 'en';
	extern?: string;
}

export interface TextFull extends TextMeta {
	html: string;
}

const filer = import.meta.glob('/src/content/texter/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

function parseFrontmatter(src: string): { data: Record<string, string>; body: string } {
	const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	if (!match) return { data: {}, body: src };
	const data: Record<string, string> = {};
	for (const rad of match[1].split(/\r?\n/)) {
		const i = rad.indexOf(':');
		if (i === -1) continue;
		data[rad.slice(0, i).trim()] = rad.slice(i + 1).trim();
	}
	return { data, body: src.slice(match[0].length) };
}

function tillMeta(path: string, src: string): TextMeta {
	const { data } = parseFrontmatter(src);
	const slug = path.split('/').pop()!.replace(/\.md$/, '');
	const datum = data.datum ?? '1970-01-01';
	return {
		slug,
		titel: data.titel ?? slug,
		datum,
		ar: datum.slice(0, 4),
		sprak: data.sprak === 'en' ? 'en' : 'sv',
		extern: data.extern || undefined
	};
}

export function allaTexter(): TextMeta[] {
	return Object.entries(filer)
		.map(([path, src]) => tillMeta(path, src))
		.sort((a, b) => b.datum.localeCompare(a.datum));
}

export function hamtaText(slug: string): TextFull | undefined {
	const post = Object.entries(filer).find(([path]) => path.endsWith(`/${slug}.md`));
	if (!post) return undefined;
	const meta = tillMeta(post[0], post[1]);
	if (meta.extern) return undefined;
	const { body } = parseFrontmatter(post[1]);
	return { ...meta, html: marked.parse(body, { async: false }) };
}
