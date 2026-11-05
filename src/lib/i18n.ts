// All text på den publika sidan, på engelska (standard) och svenska (/sv).
// Ändra text här – sidorna hämtar allt från den här filen.

export type Sprak = 'en' | 'sv';

export function sprakFran(param: string | undefined): Sprak {
	return param === 'sv' ? 'sv' : 'en';
}

// Bygger en länk i rätt språk, t.ex. lank('sv', '/om') -> '/sv/om', lank('en', '/#arbete') -> '/#arbete'
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
		animation: { pausa: 'Pause animation', spela: 'Play animation' },

		start: {
			titel: 'Nicole Boman – AI consultant, AI educator and keynote speaker',
			beskrivning: 'Nicole Boman – AI consultant, AI educator and keynote speaker. I help organisations start using generative AI in everyday work.',
			jagAr: "I'm",
			ord: ['Nicole Boman', 'an AI consultant', 'an AI educator', 'a keynote speaker'],
			skarmlasare: "I'm Nicole Boman – AI consultant, AI educator and keynote speaker.",
			lasVidare: 'Read on',
			heroAlt: 'Nicole Boman on stage in a leather jacket, gesturing to the audience, black and white',

			om: {
				etikett: '01 — About',
				rubrik: 'I get people to actually use AI.',
				stycken: [
					'I work with generative AI as a consultant, speaker and educator. I show where the technology helps in the work you already do, and we practise until you feel confident using it on your own.',
					'What you learn should be usable the day after.'
				],
				mer: 'More about me',
				bildAlt: 'Nicole Boman speaking on a runway stage, surrounded by an audience'
			},

			arbete: {
				etikett: '02 — Work',
				rubrik: 'This is what I do.',
				studioFore: 'I deliver talks, training and AI projects in collaboration with',
				studioEfter: '.',
				boka: 'Book via Studio Stén',
				poster: [
					{
						nr: '01',
						titel: 'Keynotes',
						text: "Talks on generative AI for leadership teams, conferences and industry stages. With concrete examples and an honest picture of what the technology can handle today."
					},
					{
						nr: '02',
						titel: 'Training',
						text: "Courses, masterclasses and workshops where participants work in the tools during the session, whether they're writing their first prompt or building agents."
					},
					{
						nr: '03',
						titel: 'Advisory',
						text: 'Mapping and strategy work. I go through how you work today and suggest what to tackle first.'
					}
				]
			},
			coachning: {
				etikett: '03 — 1:1 coaching',
				rubrik: 'One to one, in your own project.',
				text: "Personal help with Claude Code or Codex, online. We build something for your own work. Everything we make stays with you, and you get notes afterwards.",
				pass: [
					{ tid: '1.5 hours', titel: 'Kickstart', text: 'Get started, or move forward with something that is stuck. No preparation needed.', pris: '5 500 SEK' },
					{ tid: '3 hours', titel: 'Deep dive', text: 'Build something bigger, from scratch or on top of what you have.', pris: '11 000 SEK' }
				],
				moms: 'Excl. VAT for companies, incl. VAT for individuals.',
				boka: 'See times and book',
				bokaNot: 'Booked via Studio Stén. The booking page is in Swedish.'
			}
		},

		om: {
			titel: 'About Nicole Boman',
			etikett: 'About',
			rubrik: ['Short', 'version.'],
			bildAlt: 'Nicole Boman in profile on a dark stage',
			pastaenden: [
				{
					rubrik: 'Ten years in tech and e-commerce.',
					text: "Project manager, Client Director, CEO of a digital agency. I know what it's like when something has to be ready and working on Monday."
				},
				{
					rubrik: 'No hype.',
					text: "I show where AI saves time in your work and where it falls short, with examples you'll recognise."
				},
				{
					rubrik: "Sometimes the answer isn't AI.",
					text: "Then I'll say so. Often a change of routine is enough."
				},
				{
					rubrik: 'Nobody gets left behind.',
					text: "I talk the same way to a leadership team, a specialist and someone who has never opened ChatGPT."
				}
			],
			cta: 'Shall we?'
		},

		kontakt: {
			etikett: 'Contact',
			rubrik: ['Shall we', 'talk?'],
			text: "A talk, a training, coaching, a project or an idea you want to bounce around. Send me a message on LinkedIn and I'll get back to you.",
			linkedin: 'Message me on LinkedIn',
			sverige: 'Sweden',
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
		animation: { pausa: 'Pausa animationen', spela: 'Spela animationen' },

		start: {
			titel: 'Nicole Boman – AI-konsult, AI-utbildare och keynote speaker',
			beskrivning: 'Nicole Boman – AI-konsult, AI-utbildare och keynote speaker. Jag hjälper organisationer att börja använda generativ AI i vardagen.',
			jagAr: 'Jag är',
			ord: ['Nicole Boman', 'AI-konsult', 'AI-utbildare', 'Keynote speaker'],
			skarmlasare: 'Jag är Nicole Boman – AI-konsult, AI-utbildare och keynote speaker.',
			lasVidare: 'Läs vidare',
			heroAlt: 'Nicole Boman på scen i skinnjacka, gestikulerar mot publiken, svartvitt',

			om: {
				etikett: '01 — Om',
				rubrik: 'Jag får folk att faktiskt använda AI.',
				stycken: [
					'Jag arbetar med generativ AI som konsult, föreläsare och utbildare. Jag visar var tekniken hjälper i det jobb ni redan gör, och vi övar tills ni känner er trygga att använda den själva.',
					'Det ni lär er ska gå att använda dagen efter.'
				],
				mer: 'Mer om mig',
				bildAlt: 'Nicole Boman föreläser på en catwalkscen, omgiven av publik'
			},

			arbete: {
				etikett: '02 — Arbete',
				rubrik: 'Det här gör jag.',
				studioFore: 'Föreläsningar, utbildningar och uppdrag inom AI gör jag i samarbete med',
				studioEfter: '.',
				boka: 'Boka via Studio Stén',
				poster: [
					{
						nr: '01',
						titel: 'Keynotes',
						text: 'Föreläsningar om generativ AI för ledningsgrupper, konferenser och branschscener. Med konkreta exempel och en ärlig bild av vad tekniken klarar i dag.'
					},
					{
						nr: '02',
						titel: 'Utbildning',
						text: 'Kurser, masterclasses och workshops där deltagarna jobbar i verktygen under passet, oavsett om de skriver sin första prompt eller bygger agenter.'
					},
					{
						nr: '03',
						titel: 'Rådgivning',
						text: 'Kartläggningar och strategiarbete. Jag går igenom hur ni arbetar i dag och föreslår vad ni ska ta tag i först.'
					}
				]
			},
			coachning: {
				etikett: '03 — Coachning 1:1',
				rubrik: 'En och en, i ditt eget projekt.',
				text: 'Personlig hjälp med Claude Code eller Codex, online. Vi bygger något för ditt eget arbete. Allt vi gör stannar hos dig, och du får anteckningar efteråt.',
				pass: [
					{ tid: '1,5 h', titel: 'Kickstart', text: 'Kom igång från början, eller kom vidare med något som har kört fast. Du behöver inte förbereda något.', pris: '5 500 kr' },
					{ tid: '3 h', titel: 'Fördjupning', text: 'Tid att bygga något större, från början eller vidare på det du redan har.', pris: '11 000 kr' }
				],
				moms: 'Exkl. moms för företag, inkl. moms för privatpersoner.',
				boka: 'Se tider och boka',
				bokaNot: 'Bokas via Studio Stén.'
			}
		},

		om: {
			titel: 'Om Nicole Boman',
			etikett: 'Om',
			rubrik: ['Kort', 'version.'],
			bildAlt: 'Nicole Boman i profil på en mörk scen',
			pastaenden: [
				{
					rubrik: 'Tio år i tech och e-handel.',
					text: 'Projektledare, Client Director, vd för en digital byrå. Jag vet hur det är när något ska vara klart och fungera på måndag.'
				},
				{
					rubrik: 'Ingen hype.',
					text: 'Jag visar var AI sparar tid i ert arbete och var den brister, med exempel ni känner igen.'
				},
				{
					rubrik: 'Ibland är svaret inte AI.',
					text: 'Då säger jag det. Ofta räcker det att ändra en rutin.'
				},
				{
					rubrik: 'Alla ska hänga med.',
					text: 'Jag pratar likadant med en ledningsgrupp, en specialist och någon som aldrig har öppnat ChatGPT.'
				}
			],
			cta: 'Ska vi köra?'
		},

		kontakt: {
			etikett: 'Kontakt',
			rubrik: ['Ska vi', 'prata?'],
			text: 'Om en föreläsning, en utbildning, coachning, ett uppdrag eller en tanke du vill bolla. Skicka ett meddelande på LinkedIn så hör jag av mig.',
			linkedin: 'Skriv till mig på LinkedIn',
			sverige: 'Sverige',
			foto: 'Foto: Glide Photos, Gustaf Kumlin'
		},
	}
} as const;
