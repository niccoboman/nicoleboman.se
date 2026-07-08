import { browser } from '$app/environment';

export type Lang = 'sv' | 'en';

function initLang(): Lang {
	if (!browser) return 'sv';
	const stored = localStorage.getItem('lang');
	return stored === 'en' || stored === 'sv' ? stored : 'sv';
}

class UIState {
	lang = $state<Lang>(initLang());

	setLang(v: Lang) {
		this.lang = v;
		if (browser) {
			localStorage.setItem('lang', v);
			document.documentElement.setAttribute('lang', v);
			document.documentElement.setAttribute('data-lang', v);
		}
	}

	toggleLang() {
		this.setLang(this.lang === 'sv' ? 'en' : 'sv');
	}
}

export const ui = new UIState();
