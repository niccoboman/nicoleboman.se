# Designspec: "Galleriet" — omdesign av nicoleboman.com

**Datum:** 2026-07-08
**Status:** Godkänd av Nicole (brainstorming-session med visuella prototyper)
**Referensprototyp:** `.superpowers/brainstorm/68101-1783516596/content/riktning-v3.html` (validerad — "nuuuu snackar vi")

## Bakgrund & mål

Nuvarande sajt känns platt, generisk och tråkig. Målet är en helomvändning av den visuella identiteten som fångar Nicoles person: *art director × arkitekt × Biarritz × Berlin × barfota lyx × konstnärlig själ* — utan att kännas AI-genererad.

Kalibrerande referenser (awwwards) som Nicole valde: Roshan Sahu folio, LIVEUP inc., AI in Design Report 2026, Kasia Siwosz, State of AI 2025. Gemensamt språk: galleri-ljusa neutraler, enorma grotesk-versaler i förskjutna kompositioner, ETT konstnärligt artefakt-objekt, teknisk mikrometadata, orkestrerad rörelse.

**Uttryckligen förkastat** (kändes "AI-slop" i tidigare iterationer):
- Varm cream/beige-bas med serif-display och terracotta-accent
- Dekorativa former (gradientvalv, soldiskar) som ligger som klistermärken
- Marquee-band, lösa vertikala hårlinjer/kolumnstomme
- "Elegant serif + kursiva accentord"-tricket som bärande idé

## Visuell identitet

### Palett (endast ljust läge — temaväxlaren tas bort)
| Token | Hex | Roll |
|---|---|---|
| `gesso` | `#F1F0EC` | Bakgrund — galleri-vitt, svagt varmgrått. INTE beige. |
| `carbon` | `#141311` | Text, footerbakgrund |
| `betong` | `#A09D95` | Sekundärtext, inaktiva tillstånd |
| `sienna` | `#B23A19` | Accent — används ytterst sparsamt: punkt i rubrik, hover-tillstånd, fokusring |
| Artefaktgradient | `#26454D → #B23A19 → #E8C489` | Endast i signaturelementet |

Hairlines på indexrader: `#D9D7D0`. Footer-text dämpad: `rgba(241,240,236,.55)`.

### Typografi (Google Fonts)
- **Familjen Grotesk** — display (600, versaler, letter-spacing −0.025em, line-height 0.9–0.92) och brödtext (400). Svenskt typsnitt; bär hela identiteten.
- **Fragment Mono** — teknisk metadata: etiketter, koordinater, klocka, bildtexter. ~0.6–0.68rem, uppercase.
- **Instrument Serif** (endast kursiv) — max ETT mjukt ögonblick per sida (t.ex. manifestraden på hem). Aldrig som bärande display.

Displayskala hero/sidtitlar: `clamp(3.4rem, 11.4vw, 10.6rem)`. Indexrubriker: `clamp(1.9rem, 5vw, 4.4rem)`.

### Signaturelement: artefaktet
Ett grynigt "analogt" gradientobjekt (Atlanten möter solnedgång) byggt i ren CSS: staplade radial-gradienter + SVG-turbulens-korn (animerat, `steps(3)`, pausat vid reduced motion). Bildtext i Fragment Mono: `[ NÅGONSTANS MELLAN BIARRITZ & BERLIN ]` (EN: `[ SOMEWHERE BETWEEN BIARRITZ & BERLIN ]`).

**Förekomst:** stort på Hem (hero, höger), liten detalj på Kontakt. Ingen annanstans — sparsamheten är poängen.

### Kompositionsprinciper
- Trappstegsrubriker: rader med ökande vänsterindrag (`0 / ~9vw / ~18vw`)
- Teknisk metadata som smycke: levande STHLM-klocka (JS, uppdateras var 30 s), koordinater `59.33°N`, mono-etiketter i formen `MANIFEST / 01`
- Generöst tomrum; max-bredd 1440px; padding `clamp(20px, 3.5vw, 56px)`
- Inga dekorativa linjer. Hairlines endast som funktionella radavgränsare i index/footer.

## Sidor

Struktur behålls: **Hem · Manifest · Om mig · Arbete · Texter · Kontakt.** Tvåspråkig (SV/EN) via befintligt `i18n.ts`-system; språkväxlaren behålls, temaväxlaren tas bort.

1. **Hem** — som validerad prototyp V3: header (namn + nav), mono-metarad (roll + klocka), artefakt, trappstegshero "GENERATIV AI / PÅ MÄNSKLIGA / VILLKOR." (EN-motsvarighet tas fram vid implementation), ingress + "Scrolla ↓", manifestrad i serif-kursiv, index med 5 rader (01–05, hover: indrag + sienna-siffra), svart footer "SKA VI PRATA? → MEJLA MIG" + mono-kolumnrad (©, LinkedIn, Substack, Stockholm).
2. **Manifest** — själasidan. Sidtitel i versaler med trappstegsindrag, därefter manifestets stycken där serif-kursiven får bärande roll (undantaget från en-per-sida-regeln är medvetet här: det är sidans röst). Punkterna numreras (`01–0N`) — ordningen är retorisk och verklig.
3. **Om mig** — sidtitel + rak, personlig text i Familjen Grotesk 400. Mono-metadata för fakta (roll, bas, samarbeten). Yta förberedd för porträttfoto (aspect-ratio-platshållare i gesso-mörkare ton) tills foto finns.
4. **Arbete** — tre sektioner Keynotes / Utbildning / Rådgivning med mono-etiketter och versaltitlar. Beskrivning av roller, ingen prislista. CTA pekar mot Studio Stén för bokning.
5. **Texter** — Substack-poster/essäer som indexrader (samma radspråk som Hem-index). Länk till Substack.
6. **Kontakt** — stor "SKA VI PRATA?"-yta, mejl som primär CTA, liten artefakt-detalj, sociala länkar i mono.

Texterna ses över vid implementation så tonen matchar: rakare, mer röst, mindre broschyr. Copy skrivs på svenska först, engelska därefter.

## Rörelse

- **Load-sekvens per sida:** rubrikrader reser sig ur maskade rader (`translateY(112%) → 0`, cubic-bezier(.2,1,.25,1), stagger ~120 ms), metadata/ingress tonar in efteråt.
- **Scroll-reveals:** IntersectionObserver (threshold 0.2) sätter `.inview`; rader/stycken glider upp med stagger. Observern släpper element efter första träffen.
- **Hover-mikrointeraktioner:** indexrader (titel mörknar + skjuts in, siffra → sienna), nav-länkar (betong → carbon), footer-mejl (→ sienna).
- **Levande klocka** i hero-metaraden.
- `prefers-reduced-motion: reduce` stänger av allt (inkl. kornanimationen).
- INTE: scroll-hijack, custom cursors, parallax-rum, marquees.

## Teknik

- Befintlig SvelteKit + TypeScript + Tailwind v4-app (`projects/nicoleboman.se`). Inga nya beroenden — vanilla CSS-animationer + IntersectionObserver.
- `src/app.css`: nya tokens (`@theme`), nya typsnittsvariabler, animations-keyframes, borttagning av dark-tokens och gamla grain-overlayn (artefaktkornet är lokalt, inte helsides).
- `src/app.html` / layout: Google Fonts-länkar uppdateras till Familjen Grotesk + Fragment Mono + Instrument Serif (italic). Gamla typsnitt (Inter Tight, Newsreader, JetBrains Mono) tas bort.
- `src/routes/+layout.svelte`: ny header/footer enligt identiteten; språkväxlare kvar; temaväxlare + `ui.theme` tas bort ur `state.svelte.ts`.
- `src/lib/i18n.ts`: nya texter SV + EN.
- Sidfilerna (`+page.svelte` × 6) skrivs om. `ChapterPage.svelte` ersätts eller görs om till det nya sidtitel-mönstret.
- `/workout/**` rörs INTE (separat inloggad app under samma domän).
- Delade byggstenar hålls minimala (Nicoles uttryckliga önskan: enkel kod, ingen komponentexplosion): en `PageTitle`-komponent för trappstegstitlar + ev. en `IndexRow` — resten är sidlokal markup.

## Verifiering

- `npm run dev`: genomklick av alla sex sidor × båda språken.
- Responsivt: 375px, 768px, 1440px — trappstegsindrag och artefakt kollapsar snyggt på mobil (artefakt flyttar in i flödet, beskrivningar döljs i indexrader).
- Tillgänglighet: synlig fokusring (sienna), semantisk rubrikordning, reduced motion.
- Lighthouse-koll på typsnittsladdning (`display=swap`, preconnect).
- Befintliga tester (`npm test` — workout-logik) ska fortsatt passera.

## Utanför scope

- Foton/porträtt (yta förbereds, innehåll senare)
- Mörkt läge (borttaget medvetet)
- Substack-integration/RSS-hämtning (Texter är statisk lista tills vidare)
- Domänfrågan .se/.com (deploy-detalj, hanteras separat)
