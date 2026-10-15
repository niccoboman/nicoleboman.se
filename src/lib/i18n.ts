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
			beskrivning: 'Nicole Boman – AI consultant, AI educator and keynote speaker. Generative AI that people actually use.',
			jagAr: "I'm",
			ord: ['Nicole Boman', 'an AI consultant', 'an AI educator', 'a keynote speaker'],
			skarmlasare: "I'm Nicole Boman – AI consultant, AI educator and keynote speaker.",
			lasVidare: 'Read on',
			heroAlt: 'Nicole Boman on stage in a leather jacket, gesturing to the audience, black and white',

			om: {
				etikett: '01 — About',
				rubrik: 'I get people to actually use AI.',
				stycken: [
					'I work with generative AI as a consultant, speaker and educator. I show where the technology makes a real difference, and make sure people feel confident using it with their own judgement.',
					"If you can't use it the day after, I haven't done my job."
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
						text: "Talks on generative AI for leadership teams, conferences and industry stages. Concrete examples, clear reasoning and an honest picture of what the technology can and can't do."
					},
					{
						nr: '02',
						titel: 'Training',
						text: 'Courses, masterclasses and workshops where people actually work with the tools, from the first prompt to agents that carry out work in several steps.'
					},
					{
						nr: '03',
						titel: 'Advisory',
						text: 'Mapping and strategy work that starts with how the business really works and ends with priorities you can act on.'
					}
				]
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
					text: 'Project manager, Client Director, CEO of a digital agency. I know what it looks like when something has to work on Monday, not just in a demo.'
				},
				{
					rubrik: 'No hype.',
					text: "I show what AI can do, what it can't, and where it actually saves time. Someone else can do the selling."
				},
				{
					rubrik: "Sometimes the answer isn't AI.",
					text: "Then I'll say so. A better routine often beats a new tool."
				},
				{
					rubrik: 'Nobody gets left behind.',
					text: "Leadership team, specialist or someone who's never opened ChatGPT. Same straight talk for everyone."
				}
			],
			cta: 'Shall we?'
		},

		kontakt: {
			etikett: 'Contact',
			rubrik: ['Shall we', 'talk?'],
			text: "A talk, a training, a project or an idea you want to bounce around. Drop me a few lines and I'll get back to you.",
			sverige: 'Sweden',
			foto: 'Photo: Glide Photos, Gustaf Kumlin'
		},

		formular: {
			detGaller: "It's about",
			amnen: ['A talk', 'Training', 'A project', 'Something else'],
			namn: 'Name',
			epost: 'Email',
			organisation: 'Organisation',
			valfritt: '(optional)',
			meddelande: 'Message',
			skicka: 'Send',
			skickar: 'Sending …',
			integritet: 'I only use your details to reply to you.',
			tack: 'Thanks!',
			tackText: "Your message is in. I'll get back to you as soon as I can.",
			fel: "Something went wrong and the message wasn't sent. Try again in a moment, or reach out on LinkedIn.",
			ejKopplat: "The form isn't connected yet. Reach out on LinkedIn for now."
		}
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
			beskrivning: 'Nicole Boman – AI-konsult, AI-utbildare och keynote speaker. Generativ AI som faktiskt används.',
			jagAr: 'Jag är',
			ord: ['Nicole Boman', 'AI-konsult', 'AI-utbildare', 'Keynote speaker'],
			skarmlasare: 'Jag är Nicole Boman – AI-konsult, AI-utbildare och keynote speaker.',
			lasVidare: 'Läs vidare',
			heroAlt: 'Nicole Boman på scen i skinnjacka, gestikulerar mot publiken, svartvitt',

			om: {
				etikett: '01 — Om',
				rubrik: 'Jag får folk att faktiskt använda AI.',
				stycken: [
					'Jag arbetar med generativ AI som konsult, föreläsare och utbildare. Jag visar var tekniken gör verklig nytta, och ser till att människor blir trygga nog att använda den med eget omdöme.',
					'Det ska gå att använda dagen efter. Annars har jag inte gjort mitt jobb.'
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
						text: 'Föreläsningar om generativ AI för ledningsgrupper, konferenser och branschscener. Konkreta exempel, tydliga resonemang och en ärlig bild av vad tekniken kan och inte kan.'
					},
					{
						nr: '02',
						titel: 'Utbildning',
						text: 'Kurser, masterclasses och workshops där deltagarna arbetar med verktygen på riktigt, från den första prompten till agenter som utför arbete i flera steg.'
					},
					{
						nr: '03',
						titel: 'Rådgivning',
						text: 'Kartläggningar och strategiskt arbete som börjar i hur verksamheten faktiskt fungerar och slutar i prioriteringar som går att genomföra.'
					}
				]
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
					text: 'Projektledare, Client Director, vd för en digital byrå. Jag vet hur det ser ut när något måste funka på måndag, inte bara i en demo.'
				},
				{
					rubrik: 'Ingen hype.',
					text: 'Jag visar vad AI kan, vad den inte kan och var den faktiskt sparar tid. Resten får någon annan sälja in.'
				},
				{
					rubrik: 'Ibland är svaret inte AI.',
					text: 'Då säger jag det. En bättre rutin slår ofta ett nytt verktyg.'
				},
				{
					rubrik: 'Alla ska hänga med.',
					text: 'Ledningsgrupp, specialist eller någon som aldrig öppnat ChatGPT. Samma raka besked till alla.'
				}
			],
			cta: 'Ska vi köra?'
		},

		kontakt: {
			etikett: 'Kontakt',
			rubrik: ['Ska vi', 'prata?'],
			text: 'Om en föreläsning, en utbildning, ett uppdrag eller en tanke du vill bolla. Skriv några rader så hör jag av mig.',
			sverige: 'Sverige',
			foto: 'Foto: Glide Photos, Gustaf Kumlin'
		},

		formular: {
			detGaller: 'Det gäller',
			amnen: ['Föreläsning', 'Utbildning', 'Uppdrag', 'Något annat'],
			namn: 'Namn',
			epost: 'E-post',
			organisation: 'Organisation',
			valfritt: '(valfritt)',
			meddelande: 'Meddelande',
			skicka: 'Skicka',
			skickar: 'Skickar …',
			integritet: 'Jag använder dina uppgifter bara för att svara dig.',
			tack: 'Tack!',
			tackText: 'Ditt meddelande har kommit fram. Jag hör av mig så snart jag kan.',
			fel: 'Något gick fel och meddelandet skickades inte. Försök igen om en stund, eller hör av dig via LinkedIn.',
			ejKopplat: 'Formuläret är inte kopplat ännu. Hör av dig via LinkedIn så länge.'
		}
	}
} as const;
