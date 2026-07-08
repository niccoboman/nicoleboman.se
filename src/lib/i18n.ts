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
		common: {
			role: 'AI-konsult, keynote speaker & utbildare',
			city: 'Sthlm',
			coords: '59.33°N',
			langLabel: 'Switch to English',
			artifactCaption: '[ Någonstans mellan Biarritz & Berlin ]',
			scroll: 'Scrolla ↓'
		},
		footer: {
			cta: 'Ska vi\nprata?',
			ctaLink: '→ Mejla mig',
			copyright: '© 2026 Nicole Boman',
			place: 'Stockholm, Sverige'
		},
		home: {
			heroLines: ['Generativ AI', 'på mänskliga', 'villkor'],
			intro:
				'Jag hjälper organisationer att göra AI till något som faktiskt fungerar — för verksamheten, arbetsflödena och människorna i dem.',
			manifestLabel: 'Manifest / 01',
			manifestQuote: 'Folk följer människor, inte företag. Teknik blir verklig först när den känns.',
			indexLabel: 'Index',
			chapters: [
				{ title: 'Manifest', desc: 'Vad jag tror om AI och människor — och vad jag vägrar kompromissa med.' },
				{ title: 'Om mig', desc: 'Människan bakom rösten. Från nyfikenhet till yrke.' },
				{ title: 'Arbete', desc: 'Keynotes, utbildningar, rådgivning — så arbetar jag.' },
				{ title: 'Texter', desc: 'Boundaries of Mind — essäer om AI och människor.' },
				{ title: 'Kontakt', desc: 'Boka en scen, ett rum — eller bara säg hej.' }
			]
		},
		manifest: {
			label: 'Manifest / 01',
			titleLines: ['AI är inte', 'trollkonst'],
			theses: [
				{
					nr: '01',
					text: 'AI är inte trollkonst. Det är språk, statistik och val — inslaget i teknik. Den som förstår det slutar vara rädd och börjar ställa krav.'
				},
				{
					nr: '02',
					text: 'Folk följer människor, inte företag. Teknik blir verklig först när den känns — i ett rum, i en röst, i ett arbetsflöde som plötsligt bär.'
				},
				{
					nr: '03',
					text: 'Det tekniska går att bevisa. Det mänskliga måste diskuteras. Det som intresserar mig är vilka frågor vi vågar ställa, vem vi lyssnar på och åt vem vi bygger.'
				}
			]
		},
		about: {
			label: 'Om mig / 02',
			titleLines: ['Om mig'],
			lede: 'Jag är en översättare. Inte av språk utan av teknik — mellan det maskinen kan och det människan behöver.',
			p1: 'Till vardags AI-konsult, keynote speaker och utbildare. Baserad i Stockholm, arbetar genom Studio Stén — där klientarbete och bokningar landar.',
			p2: 'Jag hjälper organisationer förstå var AI faktiskt kan skapa värde — genom keynotes, workshops och strategiskt arbete. Samarbetar bland annat med Bonnier Akademi kring kurser i generativ AI.',
			p3: 'Det som driver mig är mellanrummen. Mellan hype och avfärdande. Mellan verktyg och mening. Mellan det tekniska som går att bevisa och det mänskliga som måste diskuteras.',
			facts: [
				{ label: 'Bas', value: 'Stockholm' },
				{ label: 'Bolag', value: 'Studio Stén' },
				{ label: 'Samarbeten', value: 'Bonnier Akademi m.fl.' }
			],
			portraitCaption: '[ Porträtt — kommer ]'
		},
		work: {
			label: 'Arbete / 03',
			titleLines: ['Arbete'],
			items: [
				{
					nr: '01',
					title: 'Keynotes',
					desc: 'Föreläsningar om generativ AI — för ledningsgrupper, branscher och scener. Raka, konkreta och utan hype.'
				},
				{
					nr: '02',
					title: 'Utbildning',
					desc: 'Praktiska workshops och kurser som gör tekniken användbar i vardagen — för team som vill komma igång på riktigt.'
				},
				{
					nr: '03',
					title: 'Rådgivning',
					desc: 'Strategiskt arbete där AI möter verksamhet och människor. Från pilot till vardag.'
				}
			],
			bookingCta: 'För bokning — Studio Stén →'
		},
		writing: {
			label: 'Texter / 04',
			titleLines: ['Texter'],
			subtitle: 'Boundaries of Mind',
			allCta: 'Alla texter på Substack →'
		},
		contact: {
			label: 'Kontakt / 05',
			titleLines: ['Säg hej'],
			body: 'Mejl är snabbast. För bokningar av keynotes, utbildningar eller rådgivning — gå via Studio Stén.',
			channels: [
				{ label: 'Mejl', value: 'info@nicoleboman.se', href: 'mailto:info@nicoleboman.se' },
				{ label: 'LinkedIn', value: 'nicoleboman', href: 'https://www.linkedin.com/in/nicoleboman/' },
				{ label: 'Substack', value: 'bomannicole', href: 'https://bomannicole.substack.com/' },
				{ label: 'Bokning', value: 'studiosten.se', href: 'https://studiosten.se' }
			]
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
		common: {
			role: 'AI consultant, keynote speaker & educator',
			city: 'Sthlm',
			coords: '59.33°N',
			langLabel: 'Byt till svenska',
			artifactCaption: '[ Somewhere between Biarritz & Berlin ]',
			scroll: 'Scroll ↓'
		},
		footer: {
			cta: 'Shall we\ntalk?',
			ctaLink: '→ Email me',
			copyright: '© 2026 Nicole Boman',
			place: 'Stockholm, Sweden'
		},
		home: {
			heroLines: ['Generative AI', 'on human', 'terms'],
			intro:
				'I help organizations make AI actually work — for the business, the workflows and the people in them.',
			manifestLabel: 'Manifesto / 01',
			manifestQuote: "People follow people, not companies. Technology only becomes real when it's felt.",
			indexLabel: 'Index',
			chapters: [
				{ title: 'Manifesto', desc: "What I believe about AI and people — and what I refuse to compromise on." },
				{ title: 'About', desc: 'The person behind the voice. From curiosity to profession.' },
				{ title: 'Work', desc: 'Keynotes, teaching, advisory — how I work.' },
				{ title: 'Writing', desc: 'Boundaries of Mind — essays on AI and people.' },
				{ title: 'Contact', desc: 'Book a stage, a room — or just say hi.' }
			]
		},
		manifest: {
			label: 'Manifesto / 01',
			titleLines: ['AI is not', 'sorcery'],
			theses: [
				{
					nr: '01',
					text: "AI is not sorcery. It's language, statistics and choice — wrapped in technology. Once you understand that, you stop being afraid and start making demands."
				},
				{
					nr: '02',
					text: "People follow people, not companies. Technology only becomes real when it's felt — in a room, in a voice, in a workflow that suddenly carries."
				},
				{
					nr: '03',
					text: 'The technical can be proven. The human must be discussed. What interests me is which questions we dare to ask, who we listen to, and for whom we build.'
				}
			]
		},
		about: {
			label: 'About / 02',
			titleLines: ['About'],
			lede: 'I am a translator. Not of languages, but of technology — between what the machine can do and what the human needs.',
			p1: 'AI consultant, keynote speaker and educator. Based in Stockholm, working through Studio Stén — where client work and bookings land.',
			p2: 'I help organizations understand where AI can actually create value — through keynotes, workshops and strategic work. Collaborating, among others, with Bonnier Akademi on courses in generative AI.',
			p3: "What drives me are the in-between spaces. Between hype and dismissal. Between tool and meaning. Between what's technical and provable, and what's human and must be discussed.",
			facts: [
				{ label: 'Base', value: 'Stockholm' },
				{ label: 'Studio', value: 'Studio Stén' },
				{ label: 'Partners', value: 'Bonnier Akademi a.o.' }
			],
			portraitCaption: '[ Portrait — coming ]'
		},
		work: {
			label: 'Work / 03',
			titleLines: ['Work'],
			items: [
				{
					nr: '01',
					title: 'Keynotes',
					desc: 'Talks on generative AI — for leadership teams, industries and stages. Direct, concrete and hype-free.'
				},
				{
					nr: '02',
					title: 'Teaching',
					desc: 'Practical workshops and courses that make the technology useful in everyday work — for teams that want to get going for real.'
				},
				{
					nr: '03',
					title: 'Advisory',
					desc: 'Strategic work where AI meets business and people. From pilot to everyday.'
				}
			],
			bookingCta: 'For booking — Studio Stén →'
		},
		writing: {
			label: 'Writing / 04',
			titleLines: ['Writing'],
			subtitle: 'Boundaries of Mind',
			allCta: 'All writing on Substack →'
		},
		contact: {
			label: 'Contact / 05',
			titleLines: ['Say hi'],
			body: 'Email is fastest. For bookings of keynotes, teaching or advisory — go via Studio Stén.',
			channels: [
				{ label: 'Email', value: 'info@nicoleboman.se', href: 'mailto:info@nicoleboman.se' },
				{ label: 'LinkedIn', value: 'nicoleboman', href: 'https://www.linkedin.com/in/nicoleboman/' },
				{ label: 'Substack', value: 'bomannicole', href: 'https://bomannicole.substack.com/' },
				{ label: 'Booking', value: 'studiosten.se', href: 'https://studiosten.se' }
			]
		}
	}
} as const;

export function getT(lang: Lang) {
	return translations[lang];
}
