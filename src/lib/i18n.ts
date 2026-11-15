// All text på den publika sidan, på engelska (standard) och svenska (/sv).
// Ändra text här – sidorna hämtar allt från den här filen.

export type Sprak = 'en' | 'sv';

export function sprakFran(param: string | undefined): Sprak {
	return param === 'sv' ? 'sv' : 'en';
}

// Bygger en länk i rätt språk, t.ex. lank('sv', '/#om') -> '/sv#om', lank('en', '/#arbete') -> '/#arbete'
export function lank(sprak: Sprak, sti: string) {
	if (sprak === 'en') return sti;
	return sti === '/' ? '/sv' : sti.startsWith('/#') ? `/sv${sti.slice(1)}` : `/sv${sti}`;
}

export const text = {
	en: {
		nav: { om: 'About', arbete: 'Work', kontakt: 'Contact' },
		hoppa: 'Skip to content',
		sprakbyte: { etikett: 'SV', namn: 'Svenska', lang: 'sv' },
		tema: { tillMork: 'Dark mode', tillLjus: 'Light mode' },
		huvudmeny: 'Main menu',
		meny: { oppna: 'Menu', stang: 'Close' },
		nyFlik: '(opens in a new tab)',
		ogAlt: 'Nicole Boman on stage, black and white',

		start: {
			titel: 'Nicole Boman – AI consultant, AI educator and keynote speaker',
			beskrivning: 'Nicole Boman – AI consultant, AI educator and keynote speaker. I help organisations put AI and agents to work in everyday tasks.',
			heroAlt: 'Nicole Boman on stage in a leather jacket, gesturing to the audience, black and white',
			titlar: 'AI consultant, AI educator and keynote speaker',
			roller: ['AI consultant', 'AI educator', 'Keynote speaker'],
			intro: "I'm Nicole. I talk AI on stage and build with it at home.",

			om: {
				etikett: 'About',
				stycken: [
					'I translate AI into your everyday work. From the first prompt to agents that do the work for you. On stage, in the classroom or at your office.',
					'What you learn should be usable the day after.'
				],
				bildAlt: 'Nicole Boman speaking on a runway stage, surrounded by an audience',
				portrattAlt: 'Portrait of Nicole Boman in a pink striped shirt against a woven wall hanging'
			},

			arbete: {
				etikett: 'Work',
				rubrik: 'Stage, classroom, boardroom, screen.',
				samarbete: 'In collaboration with',
				poster: [
					{
						nr: '01',
						titel: 'Keynotes',
						lank: 'Book a talk',
						text: 'For the leadership team, the whole organisation, the conference. On AI and agents, what the technology can do today and what it means for you.'
					},
					{
						nr: '02',
						titel: 'Training',
						lank: 'Book a training',
						text: 'Courses and workshops in AI, for beginners and for those who want to build their own agents.'
					},
					{
						nr: '03',
						titel: 'AI mapping',
						lank: 'Book a call',
						text: 'We look at how you work today and show where AI will help most first. You get a plan to start with.'
					}
				]
			},
			coachning: {
				etikett: '1:1 coaching',
				text: '1:1 in Claude Code or Codex. You leave with something that works.',
				kort: '1.5 or 3 hours, online, in Swedish.',
				boka: 'See times and book'
			}
		},

		kontakt: {
			etikett: 'Contact',
			rubrik: ['Shall we', 'talk?'],
			text: 'Message me on LinkedIn. I reply faster than a chatbot. Almost.',
			linkedin: 'Slide into my DMs',
			sverige: 'Sweden',
			sprakResor: 'Talks in English and Swedish · Based in Sweden, available worldwide',
			foto: 'Photo: Glide Photos, Gustaf Kumlin'
		},
	},

	sv: {
		nav: { om: 'Om', arbete: 'Arbete', kontakt: 'Kontakt' },
		hoppa: 'Hoppa till innehållet',
		sprakbyte: { etikett: 'EN', namn: 'English', lang: 'en' },
		tema: { tillMork: 'Mörkt läge', tillLjus: 'Ljust läge' },
		huvudmeny: 'Huvudmeny',
		meny: { oppna: 'Meny', stang: 'Stäng' },
		nyFlik: '(öppnas i en ny flik)',
		ogAlt: 'Nicole Boman på scen, svartvitt',

		start: {
			titel: 'Nicole Boman – AI-konsult, AI-utbildare och keynote speaker',
			beskrivning: 'Nicole Boman – AI-konsult, AI-utbildare och keynote speaker. Jag hjälper organisationer att använda AI och agenter i vardagen.',
			heroAlt: 'Nicole Boman på scen i skinnjacka, gestikulerar mot publiken, svartvitt',
			titlar: 'AI-konsult, AI-utbildare och keynote speaker',
			roller: ['AI-konsult', 'AI-utbildare', 'Keynote speaker'],
			intro: 'Jag är Nicole. Jag pratar AI på scen och bygger med den hemma.',

			om: {
				etikett: 'Om',
				stycken: [
					'Jag översätter AI till ert vardagsjobb. Från första prompten till agenter som gör jobbet åt er. På scen, i utbildningssalen eller på ert kontor.',
					'Det ni lär er ska gå att använda dagen efter.'
				],
				bildAlt: 'Nicole Boman föreläser på en catwalkscen, omgiven av publik',
				portrattAlt: 'Porträtt av Nicole Boman i rosa randig skjorta framför en vävd bonad'
			},

			arbete: {
				etikett: 'Arbete',
				rubrik: 'Scen, sal, styrelserum, skärm.',
				samarbete: 'I samarbete med',
				poster: [
					{
						nr: '01',
						titel: 'Keynotes',
						lank: 'Boka en föreläsning',
						text: 'För ledningsgruppen, för hela organisationen, på konferensen. Om AI och agenter, vad tekniken klarar i dag och vad det betyder för er.'
					},
					{
						nr: '02',
						titel: 'Utbildning',
						lank: 'Boka en utbildning',
						text: 'Kurser och workshops i AI för nybörjare och för dem som vill bygga egna agenter.'
					},
					{
						nr: '03',
						titel: 'AI-kartläggning',
						lank: 'Boka ett samtal',
						text: 'Vi går igenom hur ni arbetar i dag och visar var AI gör störst nytta först. Ni får en plan att börja med.'
					}
				]
			},
			coachning: {
				etikett: 'Coachning 1:1',
				text: '1:1 i Claude Code eller Codex. Du går därifrån med något som funkar.',
				kort: '1,5 eller 3 timmar, online.',
				boka: 'Se tider och boka'
			}
		},

		kontakt: {
			etikett: 'Kontakt',
			rubrik: ['Ska vi', 'prata?'],
			text: 'Skriv på LinkedIn. Jag svarar snabbare än en chattbot. Nästan.',
			linkedin: 'Hör av dig',
			sverige: 'Sverige',
			sprakResor: 'Föreläser på svenska och engelska · Bor i Sverige, reser gärna',
			foto: 'Foto: Glide Photos, Gustaf Kumlin'
		},
	}
} as const;
