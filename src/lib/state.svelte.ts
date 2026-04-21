import { browser } from '$app/environment';

export type Lang = 'sv' | 'en';
export type Theme = 'light' | 'dark';

function initLang(): Lang {
	if (!browser) return 'sv';
	const stored = localStorage.getItem('lang');
	return stored === 'en' || stored === 'sv' ? stored : 'sv';
}

function initTheme(): Theme {
	if (!browser) return 'light';
	const stored = localStorage.getItem('theme');
	if (stored === 'dark' || stored === 'light') return stored;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

class UIState {
	lang = $state<Lang>(initLang());
	theme = $state<Theme>(initTheme());

	setLang(v: Lang) {
		this.lang = v;
		if (browser) {
			localStorage.setItem('lang', v);
			document.documentElement.setAttribute('lang', v);
			document.documentElement.setAttribute('data-lang', v);
		}
	}

	setTheme(v: Theme) {
		this.theme = v;
		if (browser) {
			localStorage.setItem('theme', v);
			document.documentElement.setAttribute('data-theme', v);
		}
	}

	toggleLang() {
		this.setLang(this.lang === 'sv' ? 'en' : 'sv');
	}

	toggleTheme() {
		this.setTheme(this.theme === 'light' ? 'dark' : 'light');
	}
}

export const ui = new UIState();
