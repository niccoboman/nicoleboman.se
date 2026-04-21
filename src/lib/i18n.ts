import type { Lang } from './state.svelte';

export const translations = {
	sv: {
		nav: {
			manifest: 'Manifest',
			about: 'Om mig',
			work: 'Arbete',
			writing: 'Texter',
			contact: 'Kontakt'
		},
		home: {
			hero1: 'Översättare',
			hero2: 'mellan teknik',
			heroConnector: 'och',
			hero3: 'människa',
			paraPre: 'Jag hjälper organisationer förstå var ',
			paraHighlight: 'AI',
			paraPost: ' faktiskt kan skapa värde — genom att börja med problemet, inte verktyget.',
			roster: ['Föreläsare', 'Utbildare', 'Konsult'],
			contents: 'Innehåll',
			chapters: [
				{ title: 'Manifest', blurb: 'Vad jag tror om AI och människa' },
				{ title: 'Om mig', blurb: 'Bakgrund, roll och drivkraft' },
				{ title: 'Arbete', blurb: 'Föreläsning, utbildning, konsulting' },
				{ title: 'Texter', blurb: 'Boundaries of Mind och andra essäer' },
				{ title: 'Kontakt', blurb: 'Hör av dig' }
			]
		},
		manifest: {
			title: 'Manifest',
			part1: 'AI är inte trollkonst',
			part2:
				' — det är språk, statistik och val, inslaget i teknik. Det som intresserar mig är inte teknikens framtid utan ',
			human: 'människans',
			part3: ': vilka frågor vi vågar ställa, vem vi lyssnar på, och åt vem vi bygger.'
		},
		about: {
			title: 'Om mig',
			ledePre: 'Jag är en ',
			ledeTranslator: 'översättare',
			ledeMid: '. Inte av språk utan av teknik — mellan det som maskinen ',
			ledeCan: 'kan',
			ledeAnd: ' och det som människan ',
			ledeNeeds: 'behöver',
			ledeDot: '.',
			p1Pre: 'Till vardags AI-konsult, föreläsare och utbildare. Baserad i Sverige, jobbar genom ',
			p1Link: 'Studio Stén',
			p1Post: ' — där klientarbete och bokningar landar.',
			p2: 'Jag hjälper organisationer förstå var AI faktiskt kan skapa värde — genom workshops, keynotes och strategiskt arbete. Samarbetar bland annat med Bonnier Akademi kring kurser i generativ AI.',
			p3: 'Det som driver mig är mellanrummen. Mellan hype och avveckling. Mellan verktyg och mening. Mellan det tekniska som går att bevisa och det mänskliga som måste diskuteras.',
			pullQuote: '"Det tekniska går att bevisa. Det mänskliga måste diskuteras."',
			portraitLabel: 'Porträtt',
			portraitCaption: 'Nicole · 2026.',
			roles: [
				'Föreläsningar',
				'Utbildningar',
				'Konsulting',
				'Skrivande',
				'Paneler',
				'Rådgivning'
			]
		},
		work: {
			title: 'Arbete',
			items: [
				{
					label: 'Föreläsning',
					desc: 'Keynotes om AI — för ledning, bransch och institutioner.'
				},
				{
					label: 'Utbildning',
					desc: 'Praktiska workshops som gör teknik användbar i vardagen.'
				},
				{
					label: 'Konsulting',
					desc: 'Strategiskt arbete där AI möter verksamhet och människor.'
				}
			],
			bookingCta: 'För bokning — Studio Stén'
		},
		writing: {
			title: 'Texter',
			subtitle: 'Boundaries of Mind',
			allCta: 'Alla texter på Substack'
		},
		contact: {
			title: 'Kontakt',
			bodyPre: 'För bokningar av föreläsningar, workshops eller konsultuppdrag — gå via ',
			bodyLink: 'Studio Stén',
			bodyPost: '. För allt annat är mejl snabbast.'
		},
		common: {
			country: 'Sverige',
			langLabel: 'Byt språk',
			themeLabel: 'Byt tema'
		}
	},
	en: {
		nav: {
			manifest: 'Manifesto',
			about: 'About',
			work: 'Work',
			writing: 'Writing',
			contact: 'Contact'
		},
		home: {
			hero1: 'Translator',
			hero2: 'between technology',
			heroConnector: 'and',
			hero3: 'people',
			paraPre: 'I help organizations understand where ',
			paraHighlight: 'AI',
			paraPost:
				' can actually create value — by starting with the problem, not the tool.',
			roster: ['Speaker', 'Educator', 'Consultant'],
			contents: 'Contents',
			chapters: [
				{ title: 'Manifesto', blurb: 'What I believe about AI and people' },
				{ title: 'About', blurb: 'Background, role, motivation' },
				{ title: 'Work', blurb: 'Speaking, teaching, consulting' },
				{ title: 'Writing', blurb: 'Boundaries of Mind and other essays' },
				{ title: 'Contact', blurb: 'Get in touch' }
			]
		},
		manifest: {
			title: 'Manifesto',
			part1: 'AI is not sorcery',
			part2:
				" — it's language, statistics and choice, wrapped in technology. What interests me isn't the future of technology, but the future of ",
			human: 'people',
			part3: ': which questions we dare to ask, who we listen to, and for whom we build.'
		},
		about: {
			title: 'About',
			ledePre: 'I am a ',
			ledeTranslator: 'translator',
			ledeMid: '. Not of languages, but of technology — between what the machine ',
			ledeCan: 'can do',
			ledeAnd: ' and what the human ',
			ledeNeeds: 'needs',
			ledeDot: '.',
			p1Pre: 'AI consultant, speaker and educator. Based in Sweden, working through ',
			p1Link: 'Studio Stén',
			p1Post: ' — where client work and bookings land.',
			p2: 'I help organizations understand where AI can actually create value — through workshops, keynotes and strategic work. Collaborating, among others, with Bonnier Akademi on courses in generative AI.',
			p3: "What drives me are the in-between spaces. Between hype and dismissal. Between tool and meaning. Between what's technical and provable, and what's human and must be discussed.",
			pullQuote: '"The technical can be proven. The human must be discussed."',
			portraitLabel: 'Portrait',
			portraitCaption: 'Nicole · 2026.',
			roles: [
				'Speaking',
				'Teaching',
				'Consulting',
				'Writing',
				'Panels',
				'Advisory'
			]
		},
		work: {
			title: 'Work',
			items: [
				{
					label: 'Speaking',
					desc: 'Keynotes on AI — for leadership, industry and institutions.'
				},
				{
					label: 'Teaching',
					desc: 'Practical workshops that make technology useful in everyday work.'
				},
				{
					label: 'Consulting',
					desc: 'Strategic work where AI meets business and people.'
				}
			],
			bookingCta: 'For booking — Studio Stén'
		},
		writing: {
			title: 'Writing',
			subtitle: 'Boundaries of Mind',
			allCta: 'All writing on Substack'
		},
		contact: {
			title: 'Contact',
			bodyPre: 'For bookings of keynotes, workshops or consulting — go via ',
			bodyLink: 'Studio Stén',
			bodyPost: '. For everything else, email is fastest.'
		},
		common: {
			country: 'Sweden',
			langLabel: 'Switch language',
			themeLabel: 'Toggle theme'
		}
	}
} as const;

export function getT(lang: Lang) {
	return translations[lang];
}
