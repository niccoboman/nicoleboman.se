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
			beskrivning: 'Nicole Boman – AI consultant, AI educator and keynote speaker. I help organisations start using generative AI in everyday work.',
			heroAlt: 'Nicole Boman on stage in a leather jacket, gesturing to the audience, black and white',
			titlar: 'AI consultant, AI educator and keynote speaker',
			roller: ['AI consultant', 'AI educator', 'Keynote speaker'],
			intro: "I'm Nicole – I get people to actually use AI, in the work they already do.",

			om: {
				etikett: 'About',
				stycken: [
					'I work with generative AI as a consultant, speaker and educator. I show where the technology helps in your day-to-day work. Then we practise until you can use it on your own.',
					'What you learn should be usable the day after.'
				],
				bildAlt: 'Nicole Boman speaking on a runway stage, surrounded by an audience',
				portrattAlt: 'Portrait of Nicole Boman in a pink striped shirt against a woven wall hanging'
			},

			arbete: {
				etikett: 'Work',
				rubrik: 'This is what I do.',
				studioFore: 'I do it together with',
				studioEfter: '.',
				poster: [
					{
						nr: '01',
						titel: 'Keynotes',
						lank: 'Book a talk',
						text: 'Talks on generative AI for leadership teams and conferences, with concrete examples of what the technology can do today and where it falls short.'
					},
					{
						nr: '02',
						titel: 'Training',
						lank: 'Book a training',
						text: "Courses and workshops where participants work in the tools during the session, whether they're writing their first prompt or building agents."
					},
					{
						nr: '03',
						titel: 'Advisory',
						lank: 'Book a call',
						text: 'Mapping and strategy work. I go through how you work today and suggest what to tackle first.'
					}
				]
			},
			coachning: {
				etikett: '1:1 coaching',
				text: 'Personal help with Claude Code or Codex. We build something for your own work.',
				kort: '1.5 or 3 hours, online, in Swedish.',
				boka: 'See times and book'
			}
		},

		kontakt: {
			etikett: 'Contact',
			rubrik: ['Shall we', 'talk?'],
			text: "Get in touch if you want to book a talk or training, or just bounce an idea around. Send me a message on LinkedIn and I'll get back to you.",
			linkedin: 'Message me on LinkedIn',
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
			beskrivning: 'Nicole Boman – AI-konsult, AI-utbildare och keynote speaker. Jag hjälper organisationer att börja använda generativ AI i vardagen.',
			heroAlt: 'Nicole Boman på scen i skinnjacka, gestikulerar mot publiken, svartvitt',
			titlar: 'AI-konsult, AI-utbildare och keynote speaker',
			roller: ['AI-konsult', 'AI-utbildare', 'Keynote speaker'],
			intro: 'Jag är Nicole – jag får folk att faktiskt använda AI, i jobbet de redan gör.',

			om: {
				etikett: 'Om',
				stycken: [
					'Jag arbetar med generativ AI som konsult, föreläsare och utbildare. Jag visar var tekniken hjälper i ert vardagsarbete. Sedan övar vi tills ni kan använda den själva.',
					'Det ni lär er ska gå att använda dagen efter.'
				],
				bildAlt: 'Nicole Boman föreläser på en catwalkscen, omgiven av publik',
				portrattAlt: 'Porträtt av Nicole Boman i rosa randig skjorta framför en vävd bonad'
			},

			arbete: {
				etikett: 'Arbete',
				rubrik: 'Det här gör jag.',
				studioFore: 'Jag gör det tillsammans med',
				studioEfter: '.',
				poster: [
					{
						nr: '01',
						titel: 'Keynotes',
						lank: 'Boka en föreläsning',
						text: 'Föreläsningar om generativ AI för ledningsgrupper och konferenser, med konkreta exempel på vad tekniken klarar i dag och var den brister.'
					},
					{
						nr: '02',
						titel: 'Utbildning',
						lank: 'Boka en utbildning',
						text: 'Kurser och workshops där deltagarna jobbar i verktygen under passet, oavsett om de skriver sin första prompt eller bygger agenter.'
					},
					{
						nr: '03',
						titel: 'Rådgivning',
						lank: 'Boka ett samtal',
						text: 'Kartläggningar och strategiarbete. Jag går igenom hur ni arbetar i dag och föreslår vad ni ska ta tag i först.'
					}
				]
			},
			coachning: {
				etikett: 'Coachning 1:1',
				text: 'Personlig hjälp med Claude Code eller Codex. Vi bygger något för ditt eget arbete.',
				kort: '1,5 eller 3 timmar, online.',
				boka: 'Se tider och boka'
			}
		},

		kontakt: {
			etikett: 'Kontakt',
			rubrik: ['Ska vi', 'prata?'],
			text: 'Hör av dig om du vill boka en föreläsning eller utbildning, eller bara bolla en idé. Skicka ett meddelande på LinkedIn så svarar jag.',
			linkedin: 'Skriv till mig på LinkedIn',
			sverige: 'Sverige',
			sprakResor: 'Föreläser på svenska och engelska · Bor i Sverige, reser gärna',
			foto: 'Foto: Glide Photos, Gustaf Kumlin'
		},
	}
} as const;
