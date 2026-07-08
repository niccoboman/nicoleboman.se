# Galleriet Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bygg om nicoleboman.se:s visuella identitet till "Galleriet" enligt specen `docs/superpowers/specs/2026-07-08-galleriet-redesign-design.md` — galleri-vitt, enorma grotesk-versaler i trappstegskomposition, ett grynigt signaturartefakt, teknisk metadata, orkestrerad rörelse.

**Architecture:** Befintlig SvelteKit-app (Svelte 5 runes + Tailwind v4) byggs om i ytan: nya tokens i `app.css`, nya typsnitt i `app.html`, temaväxlaren tas bort, fem små delade byggstenar (`reveal`, `Clock`, `Artifact`, `PageTitle`, `IndexRow`), ny layout (header + global svart footer), sex omskrivna sidor, ny i18n. Inga nya beroenden.

**Tech Stack:** SvelteKit 2, Svelte 5 (runes: `$state`, `$derived`, `$props`), TypeScript, Tailwind CSS v4 (`@theme` i CSS), Google Fonts.

## Global Constraints

- Branch: `galleriet-redesign` (utgår från main). Committa aldrig på `main` eller `workout-tracker`.
- Inga nya npm-beroenden. Ingen testramverk finns — verifiering sker med `npm run check` (svelte-check) + visuell kontroll i `npm run dev`.
- Palett (exakta värden): gesso `#F1F0EC`, carbon `#141311`, betong `#A09D95`, sienna `#B23A19`, hairline `#D9D7D0`. Artefaktgradient: `#26454D → #B23A19 → #E8C489`.
- Typsnitt: Familjen Grotesk (display 600 + brödtext 400), Fragment Mono (metadata), Instrument Serif kursiv (max ett mjukt ögonblick per sida; undantag Manifest-sidan där serifen bär).
- Endast ljust läge. `prefers-reduced-motion: reduce` ska stänga av alla animationer.
- Tvåspråkigt SV/EN via befintligt mönster: `const t = $derived(translations[ui.lang])`.
- Sienna används ENDAST för: punkt i rubrik, hover-tillstånd, fokusring, artefaktet.
- Commit-meddelanden: engelska, imperativ form.
- Kodstil: följ befintlig — Tailwind-utilities i markup, tabbar för indrag, enkel kod utan onödiga abstraktioner.
- E-post: `info@nicoleboman.se`. Länkar: LinkedIn `https://www.linkedin.com/in/nicoleboman/`, Substack `https://bomannicole.substack.com/`, Studio Stén `https://studiosten.se`.

## Filstruktur

| Fil | Ansvar | Åtgärd |
|---|---|---|
| `src/app.html` | Typsnittsladdning, init-script, meta description | Skriv om |
| `src/app.css` | Tokens, basstilar, animations-keyframes, utilities | Skriv om |
| `src/lib/state.svelte.ts` | UI-state: endast språk (tema bort) | Skriv om |
| `src/lib/i18n.ts` | Alla texter SV/EN, ny struktur | Skriv om |
| `src/lib/reveal.ts` | Svelte-action för scroll-reveals | Ny |
| `src/lib/components/Clock.svelte` | Levande STHLM-klocka | Ny |
| `src/lib/components/Artifact.svelte` | Signaturartefaktet | Ny |
| `src/lib/components/PageTitle.svelte` | Trappstegstitel med load-animation | Ny |
| `src/lib/components/IndexRow.svelte` | Indexrad (Hem + Texter) | Ny |
| `src/lib/components/ChapterPage.svelte` | Gammalt sidskal | Raderas (Task 11) |
| `src/routes/+layout.svelte` | Header + global footer | Skriv om |
| `src/routes/+page.svelte` | Hem | Skriv om |
| `src/routes/manifest/+page.svelte` | Manifest | Skriv om |
| `src/routes/om-mig/+page.svelte` | Om mig | Skriv om |
| `src/routes/arbete/+page.svelte` | Arbete | Skriv om |
| `src/routes/texter/+page.svelte` | Texter | Skriv om |
| `src/routes/kontakt/+page.svelte` | Kontakt | Skriv om |

Obs: sidorna använder ChapterPage tills respektive task skriver om dem — sajten är körbar efter varje task.

---

### Task 1: Typsnitt, tokens och global CSS

**Files:**
- Modify: `src/app.html`
- Modify: `src/app.css`

**Interfaces:**
- Produces: Tailwind-tokens `bg-gesso`, `text-carbon`, `text-betong`, `text-sienna`, `border-hairline`, `font-display` (Familjen Grotesk), `font-mono` (Fragment Mono), `font-soft` (Instrument Serif); CSS-klasserna `.mono-label`, `.ln`, `.reveal`/`.inview`; keyframes `rise`, `fade`, `grain`.
- Consumes: —

**OBS:** Gamla tokens (`paper`, `sand`, `stone`, `ink`, `sage`, `wine`, `line`) och klasser (`.rule`, `.micro`, `.soften-in`, `.rise-in`) behålls temporärt i detta task så att gamla sidor fortsatt renderar — de tas bort i Task 11.

- [ ] **Step 1: Skriv om `src/app.html`**

Ersätt hela filen med:

```html
<!doctype html>
<html lang="sv">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="description" content="Nicole Boman — generativ AI på mänskliga villkor. AI-konsult, keynote speaker och utbildare i Stockholm." />

		<script>
			(function () {
				try {
					var storedLang = localStorage.getItem('lang');
					var lang = storedLang === 'en' || storedLang === 'sv' ? storedLang : 'sv';
					document.documentElement.setAttribute('lang', lang);
					document.documentElement.setAttribute('data-lang', lang);
				} catch (e) {}
			})();
		</script>

		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link
			href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Fragment+Mono&family=Instrument+Serif:ital@1&display=swap"
			rel="stylesheet"
		/>

		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

(Ändringar: theme-init borttagen, nya typsnitt, ny meta description.)

- [ ] **Step 2: Skriv om `src/app.css`**

Ersätt hela filen med:

```css
@import 'tailwindcss';

@theme {
	/* Galleriet-paletten */
	--color-gesso: #f1f0ec;
	--color-carbon: #141311;
	--color-betong: #a09d95;
	--color-sienna: #b23a19;
	--color-hairline: #d9d7d0;

	/* Gamla tokens — behålls tills alla sidor skrivits om (tas bort i Task 11) */
	--color-paper: #eee6d3;
	--color-sand: #e5dcc4;
	--color-stone: #8b8273;
	--color-ink: #1a1611;
	--color-sage: #7a8b6b;
	--color-wine: #7a2c2c;
	--color-line: #cdc2a9;

	--font-display: 'Familjen Grotesk', system-ui, sans-serif;
	--font-sans: 'Familjen Grotesk', system-ui, sans-serif;
	--font-mono: 'Fragment Mono', ui-monospace, 'SF Mono', Menlo, monospace;
	--font-soft: 'Instrument Serif', 'Iowan Old Style', Georgia, serif;
}

@layer base {
	:root {
		color-scheme: light;
	}

	html {
		background-color: var(--color-gesso);
		color: var(--color-carbon);
		font-family: var(--font-sans);
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
	}

	::selection {
		background-color: var(--color-carbon);
		color: var(--color-gesso);
	}

	a:focus-visible,
	button:focus-visible {
		outline: 2px solid var(--color-sienna);
		outline-offset: 4px;
	}

	.font-soft {
		font-family: var(--font-soft);
		font-style: italic;
	}

	/* Teknisk metadata — Galleriets smycke */
	.mono-label {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	/* Maskad rad-reveal för rubriker (load) */
	.ln {
		display: block;
		overflow: hidden;
	}
	.ln > span {
		display: block;
		transform: translateY(112%);
		animation: rise 1s cubic-bezier(0.2, 1, 0.25, 1) forwards;
	}
	.ln:nth-child(2) > span {
		animation-delay: 0.12s;
	}
	.ln:nth-child(3) > span {
		animation-delay: 0.24s;
	}
	@keyframes rise {
		to {
			transform: translateY(0);
		}
	}

	@keyframes fade {
		to {
			opacity: 1;
		}
	}
	.fade-in {
		opacity: 0;
		animation: fade 0.9s ease 0.75s forwards;
	}

	/* Scroll-reveals — reveal-elementen aktiveras av reveal-action (Task 3) */
	.reveal {
		opacity: 0;
		transform: translateY(20px);
		transition:
			opacity 0.8s ease,
			transform 0.8s cubic-bezier(0.2, 1, 0.25, 1);
	}
	.inview .reveal,
	.reveal.inview {
		opacity: 1;
		transform: none;
	}
	.inview .reveal:nth-child(2) { transition-delay: 0.06s; }
	.inview .reveal:nth-child(3) { transition-delay: 0.12s; }
	.inview .reveal:nth-child(4) { transition-delay: 0.18s; }
	.inview .reveal:nth-child(5) { transition-delay: 0.24s; }
	.inview .reveal:nth-child(6) { transition-delay: 0.3s; }

	/* Artefaktets filmkorn */
	@keyframes grain {
		0% { transform: translate(0, 0); }
		33% { transform: translate(-4%, 3%); }
		66% { transform: translate(3%, -4%); }
		100% { transform: translate(0, 0); }
	}

	@media (prefers-reduced-motion: reduce) {
		.ln > span {
			animation: none;
			transform: none;
		}
		.fade-in {
			animation: none;
			opacity: 1;
		}
		.reveal {
			transition: none;
			opacity: 1;
			transform: none;
		}
		.grain-anim {
			animation: none !important;
		}
	}

	/* ==== Gammalt — tas bort i Task 11 ==== */
	.font-serif { font-family: var(--font-sans); }
	.rule { height: 1px; background-color: var(--color-line); }
	.micro {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--color-stone);
	}
	@keyframes soften { from { opacity: 0; } to { opacity: 1; } }
	.soften-in { animation: soften 1s ease both; }
	@keyframes riseOld { from { opacity: 0; transform: translateY(0.8rem); } to { opacity: 1; transform: translateY(0); } }
	.rise-in { animation: riseOld 1.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
}
```

- [ ] **Step 3: Verifiera**

Kör: `npm run check`
Förväntat: 0 errors.

Kör: `npm run dev` — öppna http://localhost:5173. Förväntat: sajten renderar (gammal layout, nya typsnitt/bakgrund kan synas halvfärdigt — det är OK; helheten kommer taskvis).

- [ ] **Step 4: Commit**

```bash
git add src/app.html src/app.css
git commit -m "Add Galleriet design tokens, fonts and motion primitives"
```

---

### Task 2: Ta bort temat ur state

**Files:**
- Modify: `src/lib/state.svelte.ts`
- Modify: `src/routes/+layout.svelte` (endast temaknappen — layouten skrivs om helt i Task 5)

**Interfaces:**
- Produces: `ui.lang: Lang`, `ui.setLang(v)`, `ui.toggleLang()` — `Theme`-typen och tema-metoder finns inte längre.
- Consumes: —

- [ ] **Step 1: Skriv om `src/lib/state.svelte.ts`**

```typescript
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
```

- [ ] **Step 2: Ta bort temaknappen ur `src/routes/+layout.svelte`**

Radera hela `<button ...>`-blocket för tema (raderna med `onclick={() => ui.toggleTheme()}`, ca rad 40–50) samt `aria-label={t.common.themeLabel}`-användningen. Rör inget annat — filen skrivs om helt i Task 5.

- [ ] **Step 3: Verifiera**

Kör: `npm run check`
Förväntat: 0 errors (om `t.common.themeLabel` nu är oanvänd är det OK — i18n skrivs om i Task 4).

- [ ] **Step 4: Commit**

```bash
git add src/lib/state.svelte.ts src/routes/+layout.svelte
git commit -m "Remove dark theme toggle and state"
```

---

### Task 3: Delade byggstenar — reveal, Clock, Artifact, PageTitle, IndexRow

**Files:**
- Create: `src/lib/reveal.ts`
- Create: `src/lib/components/Clock.svelte`
- Create: `src/lib/components/Artifact.svelte`
- Create: `src/lib/components/PageTitle.svelte`
- Create: `src/lib/components/IndexRow.svelte`

**Interfaces:**
- Produces:
  - `reveal(node: HTMLElement): { destroy(): void }` — Svelte-action; sätter klassen `inview` på noden när den syns (threshold 0.2, engångs). Används `use:reveal`.
  - `Clock.svelte` — inga props; renderar `<span>HH:MM</span>` i Europe/Stockholm-tid, uppdateras var 30 s.
  - `Artifact.svelte` — props `{ caption: string; small?: boolean }`; renderar `<figure>` med gradient + korn + mono-bildtext. `small` ger smalare bredd (för Kontakt).
  - `PageTitle.svelte` — props `{ label: string; lines: readonly string[]; punkt?: boolean }`; mono-etikett + trappstegs-`<h1>` med load-animation; `punkt` sätter sienna-punkt efter sista raden.
  - `IndexRow.svelte` — props `{ nr: string; title: string; desc?: string; meta?: string; href: string; external?: boolean }`; a-rad med hairline-topp, hover-mikrointeraktion. Radgruppens förälder ska ha `use:reveal` + klassen `group/list` behövs inte — raderna har själva `.reveal`.
- Consumes: CSS-klasser/keyframes från Task 1.

- [ ] **Step 1: Skapa `src/lib/reveal.ts`**

```typescript
// Scroll-reveal: sätter 'inview' på noden första gången den syns.
export function reveal(node: HTMLElement) {
	const io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				if (e.isIntersecting) {
					node.classList.add('inview');
					io.disconnect();
				}
			}
		},
		{ threshold: 0.2 }
	);
	io.observe(node);
	return {
		destroy() {
			io.disconnect();
		}
	};
}
```

- [ ] **Step 2: Skapa `src/lib/components/Clock.svelte`**

```svelte
<script lang="ts">
	let now = $state(new Date());

	$effect(() => {
		const id = setInterval(() => (now = new Date()), 30_000);
		return () => clearInterval(id);
	});

	const hhmm = $derived(
		now.toLocaleTimeString('sv-SE', {
			hour: '2-digit',
			minute: '2-digit',
			timeZone: 'Europe/Stockholm'
		})
	);
</script>

<span>{hhmm}</span>
```

- [ ] **Step 3: Skapa `src/lib/components/Artifact.svelte`**

```svelte
<script lang="ts">
	let { caption, small = false }: { caption: string; small?: boolean } = $props();
</script>

<figure class={small ? 'w-[clamp(110px,13vw,180px)]' : 'w-[clamp(150px,19vw,270px)]'}>
	<div class="artifact-img relative aspect-[3/3.9] overflow-hidden transition-[filter] duration-500 hover:contrast-[1.12] hover:saturate-[1.15]"></div>
	<figcaption class="mono-label mt-2.5 !text-[0.6rem] text-betong">{caption}</figcaption>
</figure>

<style>
	.artifact-img {
		background:
			radial-gradient(120% 70% at 20% 12%, #26454d 0%, transparent 55%),
			radial-gradient(140% 90% at 80% 30%, #37535a 0%, transparent 60%),
			radial-gradient(120% 80% at 50% 78%, #c3401f 0%, transparent 58%),
			radial-gradient(100% 60% at 85% 96%, #e8c489 0%, transparent 55%),
			linear-gradient(175deg, #1d3940 0%, #55494a 46%, #b23a19 72%, #d99a54 100%);
	}
	.artifact-img::after {
		content: '';
		position: absolute;
		inset: -50%;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23g)'/></svg>");
		opacity: 0.5;
		mix-blend-mode: soft-light;
		animation: grain 1.2s steps(3) infinite;
	}
	@media (prefers-reduced-motion: reduce) {
		.artifact-img::after {
			animation: none;
		}
	}
</style>
```

- [ ] **Step 4: Skapa `src/lib/components/PageTitle.svelte`**

```svelte
<script lang="ts">
	interface Props {
		label: string;
		lines: readonly string[];
		punkt?: boolean;
	}
	let { label, lines, punkt = false }: Props = $props();

	const indents = ['', 'pl-[clamp(2rem,9vw,9rem)]', 'pl-[clamp(4rem,18vw,18rem)]'];
</script>

<div class="mono-label text-betong">{label}</div>
<h1 class="mt-[4vh] font-display text-[clamp(3.4rem,11.4vw,10.6rem)] font-semibold uppercase leading-[0.9] tracking-[-0.025em]">
	{#each lines as line, i}
		<span class="ln {indents[i] ?? ''}">
			<span>{line}{#if punkt && i === lines.length - 1}<span class="text-sienna">.</span>{/if}</span>
		</span>
	{/each}
</h1>
```

- [ ] **Step 5: Skapa `src/lib/components/IndexRow.svelte`**

```svelte
<script lang="ts">
	interface Props {
		nr: string;
		title: string;
		desc?: string;
		meta?: string;
		href: string;
		external?: boolean;
	}
	let { nr, title, desc, meta, href, external = false }: Props = $props();
</script>

<a
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
	class="reveal group flex items-baseline gap-[clamp(16px,3vw,48px)] border-t border-hairline py-[clamp(14px,2.2vw,26px)] no-underline last:border-b"
>
	<span class="mono-label min-w-[2.4em] text-betong transition-colors group-hover:text-sienna">{nr}</span>
	<h2 class="font-display text-[clamp(1.9rem,5vw,4.4rem)] font-semibold uppercase leading-none tracking-[-0.02em] text-betong transition-[color,transform] duration-300 group-hover:translate-x-[clamp(6px,1vw,16px)] group-hover:text-carbon">
		{title}
	</h2>
	{#if meta}
		<span class="mono-label ml-auto shrink-0 text-betong">{meta}</span>
	{:else if desc}
		<span class="ml-auto hidden max-w-[26ch] text-right text-[0.82rem] leading-[1.45] text-betong transition-colors group-hover:text-carbon/70 md:block">
			{desc}
		</span>
	{/if}
</a>
```

- [ ] **Step 6: Verifiera**

Kör: `npm run check`
Förväntat: 0 errors, ev. warnings om oanvända komponenter är OK.

- [ ] **Step 7: Commit**

```bash
git add src/lib/reveal.ts src/lib/components/Clock.svelte src/lib/components/Artifact.svelte src/lib/components/PageTitle.svelte src/lib/components/IndexRow.svelte
git commit -m "Add Galleriet building blocks: reveal action, Clock, Artifact, PageTitle, IndexRow"
```

---

### Task 4: Ny i18n

**Files:**
- Modify: `src/lib/i18n.ts`

**Interfaces:**
- Produces: `translations` med exakt strukturen nedan; `getT(lang)` behålls. Alla senare tasks konsumerar dessa nycklar — namnen måste stämma exakt.
- Consumes: `Lang` från `./state.svelte`.

**OBS:** Gamla sidor (som ännu inte skrivits om) refererar gamla nycklar och kommer få typfel efter detta task. Det är förväntat och accepteras temporärt — `npm run check` körs utan krav på 0 fel i just detta task; felen försvinner i Task 5–10. Sajten ska dock fortfarande STARTA i dev-läge.

- [ ] **Step 1: Skriv om `src/lib/i18n.ts`**

```typescript
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
```

- [ ] **Step 2: Verifiera att dev-servern startar**

Kör: `npm run dev` — sidan får ha runtime-fel på gamla sidor (gamla nycklar saknas), men servern ska starta. `npm run check` FÅR rapportera fel i `src/routes/**` (åtgärdas i Task 5–10) men INTE i `src/lib/**`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/i18n.ts
git commit -m "Rewrite i18n with Galleriet copy in Swedish and English"
```

---

### Task 5: Layout — header och global footer

**Files:**
- Modify: `src/routes/+layout.svelte`

**Interfaces:**
- Consumes: `ui`, `translations`, `Clock.svelte`, `reveal`, i18n-nycklarna `nav.*`, `footer.*`, `common.langLabel`.
- Produces: global sidram — header med wordmark + nav + språkväxlare, `<main>`-slot, svart footer med stor CTA. Alla sidor (Task 6–10) förlitar sig på att footern finns globalt.

- [ ] **Step 1: Skriv om `src/routes/+layout.svelte`**

```svelte
<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';
	import { reveal } from '$lib/reveal';

	let { children } = $props();

	const t = $derived(translations[ui.lang]);

	const navLinks = [
		{ href: '/manifest', key: 'manifest' as const },
		{ href: '/om-mig', key: 'about' as const },
		{ href: '/arbete', key: 'work' as const },
		{ href: '/texter', key: 'writing' as const },
		{ href: '/kontakt', key: 'contact' as const }
	];
</script>

<svelte:head>
	<title>Nicole Boman</title>
</svelte:head>

<div class="mx-auto max-w-[1440px] px-[clamp(20px,3.5vw,56px)]">
	<header class="flex items-center justify-between pt-[26px]">
		<a href="/" class="font-display text-[0.95rem] font-semibold tracking-[-0.01em] text-carbon no-underline">
			Nicole Boman
		</a>
		<div class="flex items-center gap-[clamp(18px,3vw,40px)]">
			<nav class="hidden gap-[clamp(18px,3vw,40px)] md:flex">
				{#each navLinks as link}
					{@const active = page.url.pathname === link.href}
					<a
						href={link.href}
						class="text-[0.8rem] no-underline transition-colors hover:text-carbon {active
							? 'text-carbon'
							: 'text-betong'}"
					>
						{t.nav[link.key]}
					</a>
				{/each}
			</nav>
			<button
				type="button"
				onclick={() => ui.toggleLang()}
				aria-label={t.common.langLabel}
				class="mono-label cursor-pointer border-0 bg-transparent p-0 text-betong transition-colors hover:text-carbon"
			>
				{ui.lang === 'sv' ? 'EN' : 'SV'}
			</button>
		</div>
	</header>

	<main>
		{@render children()}
	</main>
</div>

<footer class="bg-carbon pb-9 pt-[16vh] text-gesso" use:reveal>
	<div class="mx-auto max-w-[1440px] px-[clamp(20px,3.5vw,56px)]">
		<p class="reveal font-display text-[clamp(2.8rem,9vw,8rem)] font-semibold uppercase leading-[0.92] tracking-[-0.025em] whitespace-pre-line">{t.footer.cta}
			<a href="mailto:info@nicoleboman.se" class="inline-block text-gesso no-underline transition-colors hover:text-sienna">{t.footer.ctaLink}</a></p>
		<div class="reveal mt-[10vh] flex flex-wrap items-baseline justify-between gap-6 border-t border-gesso/15 pt-6">
			<span class="mono-label text-gesso/55">{t.footer.copyright}</span>
			<a class="mono-label text-gesso/55 no-underline transition-colors hover:text-gesso" href="https://www.linkedin.com/in/nicoleboman/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
			<a class="mono-label text-gesso/55 no-underline transition-colors hover:text-gesso" href="https://bomannicole.substack.com/" target="_blank" rel="noopener noreferrer">Substack</a>
			<span class="mono-label text-gesso/55">{t.footer.place}</span>
		</div>
	</div>
</footer>
```

- [ ] **Step 2: Verifiera**

Kör: `npm run dev` — kontrollera:
- Header: "Nicole Boman" vänster, nav + "EN"-knapp höger; språkväxling byter navtexterna.
- Footer: svart, "SKA VI PRATA? → MEJLA MIG" i enorma versaler (radbruten via `\n`), mono-rad under med ©/LinkedIn/Substack/plats.
- Footern glider upp när man scrollar ner till den.

Kör: `npm run check`
Förväntat: inga NYA fel utöver kvarvarande i gamla sidfiler.

- [ ] **Step 3: Commit**

```bash
git add src/routes/+layout.svelte
git commit -m "Rewrite layout with Galleriet header and global carbon footer"
```

---

### Task 6: Hem

**Files:**
- Modify: `src/routes/+page.svelte`

**Interfaces:**
- Consumes: `ui`, `translations` (`home.*`, `common.*`), `Clock`, `Artifact`, `IndexRow`, `reveal`, CSS-klasserna `.ln`, `.fade-in`, `.mono-label`, `.reveal`.
- Produces: —

- [ ] **Step 1: Skriv om `src/routes/+page.svelte`**

```svelte
<script lang="ts">
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';
	import { reveal } from '$lib/reveal';
	import Clock from '$lib/components/Clock.svelte';
	import Artifact from '$lib/components/Artifact.svelte';
	import IndexRow from '$lib/components/IndexRow.svelte';

	const t = $derived(translations[ui.lang]);

	const chapterHrefs = ['/manifest', '/om-mig', '/arbete', '/texter', '/kontakt'];
	const chapterNrs = ['01', '02', '03', '04', '05'];
</script>

<svelte:head>
	<title>Nicole Boman — {t.common.role}</title>
</svelte:head>

<!-- Hero -->
<section class="relative flex min-h-[92svh] flex-col justify-between pb-[6vh] pt-[10vh]">
	<div class="mono-label flex items-baseline justify-between">
		<span>{t.common.role}</span>
		<span class="text-betong">{t.common.city} <Clock /> · {t.common.coords}</span>
	</div>

	<div class="absolute right-0 top-[16vh] hidden md:block">
		<Artifact caption={t.common.artifactCaption} />
	</div>

	<h1 class="font-display text-[clamp(3.4rem,11.4vw,10.6rem)] font-semibold uppercase leading-[0.9] tracking-[-0.025em]">
		{#each t.home.heroLines as line, i}
			<span class="ln {i === 1 ? 'pl-[clamp(2rem,9vw,9rem)]' : i === 2 ? 'pl-[clamp(4rem,18vw,18rem)]' : ''}">
				<span>{line}{#if i === t.home.heroLines.length - 1}<span class="text-sienna">.</span>{/if}</span>
			</span>
		{/each}
	</h1>

	<div class="mono-label fade-in flex items-end justify-between gap-8">
		<p class="max-w-[38ch] font-sans text-[0.95rem] normal-case leading-[1.5] tracking-normal text-carbon/75">
			{t.home.intro}
		</p>
		<span class="hidden text-betong md:block">{t.common.scroll}</span>
	</div>

	<div class="mt-[8vh] md:hidden">
		<Artifact caption={t.common.artifactCaption} />
	</div>
</section>

<!-- Manifestrad — sidans enda mjuka ögonblick -->
<section class="py-[22vh]" use:reveal>
	<span class="mono-label mb-[4vh] block text-betong">{t.home.manifestLabel}</span>
	<p class="reveal font-soft max-w-[22ch] text-[clamp(1.8rem,4.4vw,3.6rem)] leading-[1.15] tracking-[-0.01em]">
		{t.home.manifestQuote}
	</p>
</section>

<!-- Index -->
<section class="pb-[16vh]" use:reveal>
	<span class="mono-label reveal mb-[3vh] block text-betong">{t.home.indexLabel}</span>
	{#each t.home.chapters as chapter, i}
		<IndexRow nr={chapterNrs[i]} title={chapter.title} desc={chapter.desc} href={chapterHrefs[i]} />
	{/each}
</section>
```

- [ ] **Step 2: Verifiera i dev-servern**

Kontrollera på http://localhost:5173:
- Load: tre rubrikrader reser sig maskade med stagger; metarad + ingress tonar in efteråt.
- Artefaktet uppe till höger med korn som "lever"; hover ger mer kontrast.
- Klockan visar aktuell Stockholmstid.
- Trappstegsindrag på rad 2 och 3; sienna-punkt efter "villkor"/"terms".
- Scroll: manifestraden (serif-kursiv) glider upp; indexrader staggrar in; hover på rad = titel mörknar + skjuts höger, siffran blir sienna.
- Språkväxling till EN byter allt innehåll.
- Mobil (DevTools 375px): artefakt under ingressen, beskrivningar dolda i index.

- [ ] **Step 3: Kör check + commit**

Kör: `npm run check` — inga fel i denna fil.

```bash
git add src/routes/+page.svelte
git commit -m "Rewrite home page with staircase hero, artifact and index"
```

---

### Task 7: Manifest

**Files:**
- Modify: `src/routes/manifest/+page.svelte`

**Interfaces:**
- Consumes: `PageTitle` (`{ label, lines, punkt }`), `reveal`, i18n `manifest.*` (`label`, `titleLines`, `theses[{nr,text}]`).
- Produces: —

- [ ] **Step 1: Skriv om `src/routes/manifest/+page.svelte`**

```svelte
<script lang="ts">
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';
	import { reveal } from '$lib/reveal';
	import PageTitle from '$lib/components/PageTitle.svelte';

	const t = $derived(translations[ui.lang]);
</script>

<svelte:head>
	<title>{t.nav.manifest} · Nicole Boman</title>
</svelte:head>

<article class="pb-[16vh] pt-[10vh]">
	<PageTitle label={t.manifest.label} lines={t.manifest.titleLines} punkt />

	<!-- Manifestets teser — serifen bär (medvetet undantag från en-per-sida-regeln) -->
	<div class="mt-[14vh] flex flex-col gap-[10vh]">
		{#each t.manifest.theses as thesis}
			<div class="flex flex-col gap-4 md:flex-row md:gap-[clamp(24px,6vw,96px)]" use:reveal>
				<span class="mono-label reveal shrink-0 pt-3 text-sienna">{thesis.nr}</span>
				<p class="reveal font-soft max-w-[26ch] text-[clamp(1.6rem,3.6vw,3rem)] leading-[1.2] tracking-[-0.01em]">
					{thesis.text}
				</p>
			</div>
		{/each}
	</div>
</article>
```

- [ ] **Step 2: Verifiera i dev-servern**

http://localhost:5173/manifest — titel "AI ÄR INTE / TROLLKONST." med trappstegsindrag och sienna-punkt; tre teser i stor serif-kursiv som glider upp vid scroll, sienna-numrerade. Båda språken.

- [ ] **Step 3: Kör check + commit**

Kör: `npm run check` — inga fel i denna fil.

```bash
git add src/routes/manifest/+page.svelte
git commit -m "Rewrite manifesto page with numbered theses in soft serif"
```

---

### Task 8: Om mig

**Files:**
- Modify: `src/routes/om-mig/+page.svelte`

**Interfaces:**
- Consumes: `PageTitle`, `reveal`, i18n `about.*` (`label`, `titleLines`, `lede`, `p1`, `p2`, `p3`, `facts[{label,value}]`, `portraitCaption`).
- Produces: —

- [ ] **Step 1: Skriv om `src/routes/om-mig/+page.svelte`**

```svelte
<script lang="ts">
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';
	import { reveal } from '$lib/reveal';
	import PageTitle from '$lib/components/PageTitle.svelte';

	const t = $derived(translations[ui.lang]);
</script>

<svelte:head>
	<title>{t.nav.about} · Nicole Boman</title>
</svelte:head>

<article class="pb-[16vh] pt-[10vh]">
	<PageTitle label={t.about.label} lines={t.about.titleLines} />

	<div class="mt-[12vh] grid grid-cols-1 gap-[8vh] md:grid-cols-12 md:gap-x-[clamp(24px,4vw,64px)]">
		<div class="md:col-span-7" use:reveal>
			<!-- Sidans enda mjuka ögonblick -->
			<p class="reveal font-soft max-w-[24ch] text-[clamp(1.7rem,3.8vw,3.2rem)] leading-[1.18] tracking-[-0.01em]">
				{t.about.lede}
			</p>
			<div class="mt-[8vh] flex max-w-[52ch] flex-col gap-6 text-[0.98rem] leading-[1.6] text-carbon/80">
				<p class="reveal">{t.about.p1}</p>
				<p class="reveal">{t.about.p2}</p>
				<p class="reveal">{t.about.p3}</p>
			</div>
		</div>

		<div class="md:col-span-4 md:col-start-9" use:reveal>
			<!-- Porträttyta — förberedd, innehåll senare -->
			<figure class="reveal">
				<div class="aspect-[3/3.9] bg-carbon/[0.06]"></div>
				<figcaption class="mono-label mt-2.5 !text-[0.6rem] text-betong">{t.about.portraitCaption}</figcaption>
			</figure>
			<dl class="reveal mt-[6vh] flex flex-col">
				{#each t.about.facts as fact}
					<div class="flex items-baseline justify-between border-t border-hairline py-3 last:border-b">
						<dt class="mono-label text-betong">{fact.label}</dt>
						<dd class="text-[0.85rem] text-carbon">{fact.value}</dd>
					</div>
				{/each}
			</dl>
		</div>
	</div>
</article>
```

- [ ] **Step 2: Verifiera i dev-servern**

http://localhost:5173/om-mig — lede i serif-kursiv, tre stycken, porträttplatshållare + faktalista till höger (staplas under på mobil). Båda språken.

- [ ] **Step 3: Kör check + commit**

Kör: `npm run check` — inga fel i denna fil.

```bash
git add src/routes/om-mig/+page.svelte
git commit -m "Rewrite about page with soft lede, portrait slot and facts"
```

---

### Task 9: Arbete

**Files:**
- Modify: `src/routes/arbete/+page.svelte`

**Interfaces:**
- Consumes: `PageTitle`, `reveal`, i18n `work.*` (`label`, `titleLines`, `items[{nr,title,desc}]`, `bookingCta`).
- Produces: —

- [ ] **Step 1: Skriv om `src/routes/arbete/+page.svelte`**

```svelte
<script lang="ts">
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';
	import { reveal } from '$lib/reveal';
	import PageTitle from '$lib/components/PageTitle.svelte';

	const t = $derived(translations[ui.lang]);
</script>

<svelte:head>
	<title>{t.nav.work} · Nicole Boman</title>
</svelte:head>

<article class="pb-[16vh] pt-[10vh]">
	<PageTitle label={t.work.label} lines={t.work.titleLines} />

	<div class="mt-[12vh]" use:reveal>
		{#each t.work.items as item}
			<section class="reveal grid grid-cols-1 gap-4 border-t border-hairline py-[clamp(24px,4vw,48px)] md:grid-cols-12 md:gap-x-[clamp(24px,4vw,64px)]">
				<span class="mono-label text-betong md:col-span-1">{item.nr}</span>
				<h2 class="font-display text-[clamp(1.9rem,5vw,4.4rem)] font-semibold uppercase leading-none tracking-[-0.02em] md:col-span-6">
					{item.title}
				</h2>
				<p class="max-w-[38ch] text-[0.95rem] leading-[1.55] text-carbon/75 md:col-span-5 md:justify-self-end md:text-right">
					{item.desc}
				</p>
			</section>
		{/each}
	</div>

	<div class="mt-[10vh]" use:reveal>
		<a
			href="https://studiosten.se"
			target="_blank"
			rel="noopener noreferrer"
			class="mono-label reveal inline-block text-carbon no-underline transition-colors hover:text-sienna"
		>
			{t.work.bookingCta}
		</a>
	</div>
</article>
```

- [ ] **Step 2: Verifiera i dev-servern**

http://localhost:5173/arbete — tre sektioner med sienna-fria mono-nummer, versaltitlar, beskrivning höger; boknings-CTA mot Studio Stén längst ner (hover → sienna). Båda språken.

- [ ] **Step 3: Kör check + commit**

Kör: `npm run check` — inga fel i denna fil.

```bash
git add src/routes/arbete/+page.svelte
git commit -m "Rewrite work page with three service sections"
```

---

### Task 10: Texter

**Files:**
- Modify: `src/routes/texter/+page.svelte`

**Interfaces:**
- Consumes: `PageTitle`, `IndexRow` (med `meta` + `external`), `reveal`, i18n `writing.*` (`label`, `titleLines`, `subtitle`, `allCta`).
- Produces: —

- [ ] **Step 1: Skriv om `src/routes/texter/+page.svelte`**

```svelte
<script lang="ts">
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';
	import { reveal } from '$lib/reveal';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import IndexRow from '$lib/components/IndexRow.svelte';

	const t = $derived(translations[ui.lang]);

	const texter = [
		{ title: 'Time Out', year: '2025', href: 'https://bomannicole.substack.com/p/time-out' },
		{
			title: 'Defining Artificial Intelligence',
			year: '2025',
			href: 'https://bomannicole.substack.com/p/defining-artificial-intelligence'
		},
		{
			title: 'Is Marketing Ruining Art?',
			year: '2024',
			href: 'https://bomannicole.substack.com/p/is-marketing-ruining-art'
		}
	];
</script>

<svelte:head>
	<title>{t.nav.writing} · Nicole Boman</title>
</svelte:head>

<article class="pb-[16vh] pt-[10vh]">
	<PageTitle label={t.writing.label} lines={t.writing.titleLines} />

	<div class="mt-[12vh]" use:reveal>
		<span class="mono-label reveal mb-[3vh] block text-betong">{t.writing.subtitle}</span>
		{#each texter as text, i}
			<IndexRow nr={String(i + 1).padStart(2, '0')} title={text.title} meta={text.year} href={text.href} external />
		{/each}
	</div>

	<div class="mt-[8vh]" use:reveal>
		<a
			href="https://bomannicole.substack.com/"
			target="_blank"
			rel="noopener noreferrer"
			class="mono-label reveal inline-block text-carbon no-underline transition-colors hover:text-sienna"
		>
			{t.writing.allCta}
		</a>
	</div>
</article>
```

- [ ] **Step 2: Verifiera i dev-servern**

http://localhost:5173/texter — "Boundaries of Mind"-etikett, tre essärader (titel + årtal i mono, öppnas i ny flik), Substack-CTA. Båda språken.

- [ ] **Step 3: Kör check + commit**

Kör: `npm run check` — inga fel i denna fil.

```bash
git add src/routes/texter/+page.svelte
git commit -m "Rewrite writing page with essay index rows"
```

---

### Task 11: Kontakt + radera ChapterPage + städa CSS

**Files:**
- Modify: `src/routes/kontakt/+page.svelte`
- Delete: `src/lib/components/ChapterPage.svelte`
- Modify: `src/app.css` (ta bort "Gammalt"-blocket + gamla tokens)

**Interfaces:**
- Consumes: `PageTitle`, `Artifact` (`small`), `reveal`, i18n `contact.*` (`label`, `titleLines`, `body`, `channels[{label,value,href}]`).
- Produces: —

- [ ] **Step 1: Skriv om `src/routes/kontakt/+page.svelte`**

```svelte
<script lang="ts">
	import { ui } from '$lib/state.svelte';
	import { translations } from '$lib/i18n';
	import { reveal } from '$lib/reveal';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import Artifact from '$lib/components/Artifact.svelte';

	const t = $derived(translations[ui.lang]);
</script>

<svelte:head>
	<title>{t.nav.contact} · Nicole Boman</title>
</svelte:head>

<article class="pb-[16vh] pt-[10vh]">
	<PageTitle label={t.contact.label} lines={t.contact.titleLines} punkt />

	<div class="mt-[12vh] grid grid-cols-1 gap-[8vh] md:grid-cols-12 md:gap-x-[clamp(24px,4vw,64px)]">
		<div class="md:col-span-7" use:reveal>
			<p class="reveal max-w-[42ch] text-[1.05rem] leading-[1.6] text-carbon/80">{t.contact.body}</p>
			<dl class="reveal mt-[8vh] flex max-w-[560px] flex-col">
				{#each t.contact.channels as channel}
					<div class="group flex items-baseline justify-between gap-6 border-t border-hairline py-4 last:border-b">
						<dt class="mono-label text-betong">{channel.label}</dt>
						<dd>
							<a
								href={channel.href}
								target={channel.href.startsWith('mailto:') ? undefined : '_blank'}
								rel={channel.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
								class="text-[0.95rem] text-carbon no-underline transition-colors hover:text-sienna"
							>
								{channel.value}
							</a>
						</dd>
					</div>
				{/each}
			</dl>
		</div>

		<div class="md:col-span-3 md:col-start-10" use:reveal>
			<div class="reveal">
				<Artifact caption={t.common.artifactCaption} small />
			</div>
		</div>
	</div>
</article>
```

- [ ] **Step 2: Radera ChapterPage**

```bash
rm src/lib/components/ChapterPage.svelte
```

- [ ] **Step 3: Städa `src/app.css`**

Ta bort hela blocket `/* ==== Gammalt — tas bort i Task 11 ==== */` (t.o.m. `.rise-in`-regeln) samt de sju gamla färgtokens (`--color-paper` t.o.m. `--color-line`) ur `@theme`.

- [ ] **Step 4: Verifiera**

Kör: `grep -rn "ChapterPage\|color-paper\|color-sage\|color-wine\|soften-in\|rise-in\|\.rule\b\|\.micro\b" src/` — förväntat: inga träffar.

Kör: `npm run check`
Förväntat: **0 errors totalt** — alla sidor är nu omskrivna.

- [ ] **Step 5: Commit**

```bash
git add src/routes/kontakt/+page.svelte src/app.css
git rm src/lib/components/ChapterPage.svelte 2>/dev/null; git add -A src/lib/components/
git commit -m "Rewrite contact page, delete ChapterPage, drop legacy tokens"
```

---

### Task 12: Slutverifiering

**Files:**
- Ingen ny kod — verifiering och ev. småfixar.

- [ ] **Step 1: Full check + build**

```bash
npm run check && npm run build
```
Förväntat: 0 errors, bygget lyckas.

- [ ] **Step 2: Genomklick — desktop**

`npm run dev` (eller `npm run preview` efter build). Gå igenom alla sex sidor på SV, växla till EN, gå igenom igen. Kontrollera:
- Alla load-animationer (rubrikrader), scroll-reveals, hover-tillstånd.
- Footern på alla sidor; mejllänk hover → sienna.
- Inga rester av gamla gröna/vinröda färger eller EB Garamond någonstans.

- [ ] **Step 3: Responsivt + tillgänglighet**

- DevTools: 375px, 768px, 1440px — trappstegsindrag skalar, artefakt flyttar in i flödet på mobil, inga horisontella scrollbars.
- Tab-navigera: fokusring (sienna) syns på alla länkar/knappar.
- DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce": inga animationer, allt innehåll direkt synligt (inget fastnar på opacity 0).
- Nätverksfliken: typsnitt laddas med `display=swap`; inga 404:or.

- [ ] **Step 4: Åtgärda ev. fynd och committa**

```bash
git add -A
git commit -m "Polish responsive and accessibility details after full review"
```
(Endast om fynd fanns — annars hoppa över.)

- [ ] **Step 5: Pusha branchen**

```bash
git push -u origin galleriet-redesign
```
Vercel bygger en preview-deploy av branchen — dela preview-URL:en med Nicole för slutgodkännande innan merge till main.
