# Training Tracker — Design Spec

**Datum:** 2026-05-05
**Författare:** Nicole + Claude (brainstorming)
**Status:** Godkänd, klar för implementations-planering
**Plats:** Ny route-grupp `/workout/*` i existerande SvelteKit-sajten `nicoleboman.se`
**Live-URL:** `nicoleboman.se/workout`

---

## Bakgrund och syfte

Nicole har en detaljerad 12-veckors hemträningsplan ("The Ultimate Home Training Plan v2") som idag finns som en statisk HTML-fil. Hon vill kunna:

1. Få upp dagens pass på mobilen utan att tänka
2. Logga vad hon faktiskt gjorde — vikt, reps, känsla — under eller efter passet
3. Se progression över tid (PR + grafer) för att hålla motivationen uppe under de "osynliga veckorna" 3–8

Tracker:n är en personlig app: en användare (Nicole), bakom inlogg, som integrerar med planen utan att kräva ändringar i den.

## Mål

- **Sänka friktionen** att logga ett pass live från mobil till "tap → tap → klar"
- **Visualisera progression** på ett sätt som matchar planens performance-benchmark-filosofi (siffror över tid, inte vågen)
- **Återanvända existerande infrastruktur** — SvelteKit-sajten, Supabase-stacken Nicole redan kan, Vercel-deployen som redan rullar
- **Hålla bundle och scope litet** — minimala dependencies, ingen plan-editor, inget multi-user

## Icke-mål (medvetet utelämnat)

- Helt redigerbar plan (planen är hårdkodad — avvikelser noteras i loggen, inte i planen)
- Benchmark-test-flöde (push-up max, KB swing max, deep squat-tid) — sparas till senare
- Nutrition-tracking, steg-tracking, foton, mått ("appearance tracking") — utanför scope
- Multi-user / publik delning
- Native iOS/Android-app (PWA räcker)
- Substitutions-tabell för bytta övningar (skrivs i `notes` istället)

## Hög-nivå-arkitektur

```
nicoleboman.se (existerande SvelteKit-sajt)
├── Hem · Om mig · Vad jag gör · Texter · Manifest · Kontakt   (existerande)
└── /workout/*                                                   (NY)
    ├── login              — Supabase Auth
    ├── /                  — startskärm, dagens pass
    ├── /session/[passId]  — loggnings-vy
    ├── /history           — alla loggade pass
    ├── /exercise/[slug]   — per-övning progression + PR + historik
    └── /plan              — referensvy av hela planen

Stack: SvelteKit 2 + Svelte 5 + TypeScript + Tailwind v4
Backend: Supabase (Auth + Postgres med RLS)
Deploy: Vercel (existerande projekt)
PWA: ja, från start
```

## URL-struktur & sidor

| URL | Syfte | Auth |
|---|---|---|
| `/workout/login` | Email + lösenord login (Supabase Auth) | publik |
| `/workout` | Startskärm: dagens föreslagna pass enligt veckodag, override-knappar för andra pass, senaste 3 pass i historiken, senaste PR | krävs |
| `/workout/session/[passId]` | Loggnings-vy. Övningar med set-rader, vilo-timer, anteckningsfält, "Avsluta passet" | krävs |
| `/workout/history` | Kronologisk lista över alla loggade pass, filter på pass-typ | krävs |
| `/workout/exercise/[slug]` | Per-övning: progressionsgraf, PR-badge, all set-historik | krävs |
| `/workout/plan` | Statisk referensvy av hela planen — adapterad från Nicoles existerande HTML | krävs |

**Auth-skydd:** `/workout/+layout.server.ts` kollar Supabase-session. Utloggad → redirect till `/workout/login`. Resten av nicoleboman.se opåverkad.

## Plan-data (i koden, inte i databasen)

Planen är hårdkodad som TypeScript-konstanter i `src/lib/workout/plan.ts`. Detta valdes för att:
- Planen är medvetet designad för 12 veckor och ska inte förändras dagligen
- Ingen plan-editor behöver byggas
- Type-safe referenser i hela appen

**Strukturen:**

```typescript
// src/lib/workout/plan.ts (skiss)

export type ExerciseKey = 'goblet_squat' | 'push_up' | 'kb_press' | ... ;

export type WorkoutKey = 'strength_a' | 'strength_b' | 'strength_c'
                      | 'cardio_z2' | 'active_recovery' | 'emom';

export type ExerciseUnit = 'reps' | 'seconds';

export interface PlanExercise {
  key: ExerciseKey;
  name: string;
  unit: ExerciseUnit;                // 'reps' eller 'seconds' (för tids-baserade)
  targetSets: number;
  targetMin: number;                 // antal reps eller sekunder
  targetMax: number;                 // samma som min om fast antal
  amrap?: boolean;                   // true för "AMRAP"-övningar (push-up)
  targetWeightKg: number | null;     // null = bodyweight
  loadDescription: string;           // t.ex. "12 kg KB", "2× 12 kg KB", "Bodyweight"
  cue: string;                       // coaching-cue
  restSeconds: number;               // default 90, kan vara 60 för isolation
  perSide?: boolean;                 // true för enarms-/enbensövningar
}

export type WorkoutKind = 'strength' | 'cardio' | 'practice' | 'interval';

export interface Workout {
  key: WorkoutKey;
  kind: WorkoutKind;                 // styr hur loggnings-vyn renderas
  name: string;
  subtitle: string;                  // t.ex. "Squat & Push"
  durationMinutes: string;           // t.ex. "45–55"
  exercises: PlanExercise[];         // tom array för cardio (det är fritt)
  cardioOptions?: string[];          // för kind=cardio: ['Brisk walk', 'Cycling', ...]
}

export const WORKOUTS: Record<WorkoutKey, Workout> = { ... };

export const WEEKLY_SCHEDULE: Record<Weekday, WorkoutKey | null> = {
  monday: 'strength_a',
  tuesday: 'cardio_z2',
  wednesday: 'strength_b',
  thursday: 'active_recovery',
  friday: 'strength_c',
  saturday: 'emom',           // optional, men föreslås
  sunday: null,               // rest
};

export const DAILY_MOBILITY_POOL: PlanExercise[] = [ ... ];
export const UNIVERSAL_WARMUP: PlanExercise[] = [ ... ];
```

Källa för all plan-data: `ultimate_workout_plan_v2.docx` + `workout_plan_mobile.html`.

## Datamodell (Supabase Postgres)

Endast två tabeller. RLS aktiverat på båda.

```sql
-- Pass-loggar
create table public.sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  workout_key     text not null,           -- vad som faktiskt kördes
  planned_key     text not null,           -- vad veckoschemat föreslog när du startade
  started_at      timestamptz not null default now(),
  completed_at    timestamptz,             -- null = pågår
  notes           text,
  -- För kind=cardio/practice/interval (null för strength)
  duration_min    int,                     -- faktisk varaktighet i minuter
  activity_type   text,                    -- t.ex. 'Brisk walk', 'Cycling', 'TGU practice'
  created_at      timestamptz not null default now()
);

create index sessions_user_started_idx on public.sessions(user_id, started_at desc);

-- Set-loggar (bara för kind=strength)
create table public.session_sets (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid not null references public.sessions(id) on delete cascade,
  user_id        uuid not null references auth.users(id) on delete cascade,
  exercise_key   text not null,
  set_number     int  not null,           -- 1, 2, 3, ...
  side           text,                    -- 'left' | 'right' | null (null för bilateral)
  value          int  not null,           -- reps ELLER sekunder beroende på övningens unit
  weight_kg      numeric(5,2),            -- null = bodyweight
  rir            int,                     -- 0–5, null = inte angivet
  logged_at      timestamptz not null default now()
);

-- Övningens unit (reps/seconds) härleds från plan-data i koden, inte sparas i DB.
-- side krävs när PlanExercise.perSide = true (en rad per sida).

create index session_sets_session_idx on public.session_sets(session_id);
create index session_sets_user_exercise_idx
  on public.session_sets(user_id, exercise_key, logged_at desc);

-- RLS
alter table public.sessions enable row level security;
alter table public.session_sets enable row level security;

create policy "Own sessions" on public.sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Own session_sets" on public.session_sets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

`session_sets.user_id` är denormaliserat (kan härledas från `session_id`) men ger triviala RLS-policies och effektivt index för progression-queries per övning.

**Avvikelse-tracking:** `workout_key != planned_key` → vi kan rapportera "den här veckan körde du Strength B på en fredag istället för Strength C".

**Pågående pass:** `completed_at IS NULL`. På startskärmen kollar vi efter en sådan; finns det → "Fortsätt passet" istället för "Starta nytt".

**Bytte övning mitt i passet:** loggas med rätt `exercise_key` (t.ex. `reverse_lunge` istället för `bulgarian_split_squat`) + valfri anteckning i `sessions.notes`. Ingen separat substitutions-tabell.

## Loggnings-flow

Loggnings-vyn `/workout/session/[passId]` är samma vy live som efter passet — bara timing skiljer. Vyn renderas olika beroende på `Workout.kind`:

| `kind` | Pass-exempel | Loggnings-UI |
|---|---|---|
| `strength` | Strength A/B/C | Set-rader per övning (reps, vikt, RIR), vilo-timer, "Som planerat" |
| `cardio` | Cardio Z2 (tisdag) | Aktivitetstyp-väljare (`cardioOptions`), `duration_min`-input, anteckning |
| `practice` | Active Recovery (torsdag) | Checklista över rekommenderade aktiviteter (walk, TGU practice, mobility), `duration_min`-input, anteckning |
| `interval` | EMOM (lördag) | Block-räknare (5 block × 3 min), bock-av-rader, anteckning |

Ingen `session_sets`-rad skapas för icke-strength-pass. Bara `sessions`-raden uppdateras.

Resten av detta avsnitt beskriver strength-flödet, som är default-fallet och det vanligaste.

**Layout (mobile-first):**

- Header: passnamn, starttid, X/Y övningar klara
- Per övning: ett kort med mål (set × reps @ vikt), cue, set-rader
- Per set-rad: `[value] [vikt kg] [RIR]` med förifyllt mål-värde. För `unit=seconds`-övningar visar fältet "sek" istället för "reps". För `perSide=true`-övningar finns två rader per set (V/H).
- Anteckningsfält längst ned (frivilligt, sparas på `sessions.notes`)
- "Avsluta passet"-knapp längst ned: sätter `completed_at = now()`

**Beteende:**

- **Förifyllning:** mål-värden från plan-data ligger i fälten — ändra bara om annorlunda
- **Auto-completion:** så fort både `value` och `weight_kg` är giltiga räknas set:en som klar; `logged_at` sätts. För bodyweight-övningar räcker `value`. För perSide-övningar räcker en sida för att markera den sidan klar. Rad får grön accent.
- **Auto-spara:** debounced (500 ms) upsert till Supabase efter varje fält-ändring. Tappar du nät/stänger fliken — allt sparat. Mer aggressiv flush vid tab-blur.
- **"Som planerat"-knapp** per övning: fyller alla set med planens mål-värden i ett klick.
- **Lägg till extra set / Hoppa över övning:** synliga sekundärknappar per övning.
- **Vilo-timer:** nedräkning från `restSeconds` (default 90) startar automatiskt när set räknas som klar. Sticky pill längst ned. Ljud + Web Vibration API vid 0. Kan stängas/skippas.
- **Wake Lock API:** håller telefonens skärm vaken medan loggnings-vyn är öppen.
- **Avsluta:** sätter `completed_at`. Pass kan återöppnas och redigeras senare.

**Avvikelser från planen:**

| Typ | Hur loggas |
|---|---|
| Annan vikt eller reps | Bara fyll i annat värde |
| Annan övning för en plats i passet | Välj annan `exercise_key` (kommer i en framtida iteration; för MVP räcker att skriva i `notes`) |
| Helt annat pass | Startskärmens "kör annat pass"-flöde sätter `workout_key != planned_key` när session skapas |

## PR-detektion + progressionsgrafer

**PR-typer (per `exercise_key` per `user_id`):**

1. **Value-PR per vikt-nivå** — flest reps eller längsta tid på en specifik vikt. T.ex. "11 reps @ 12 kg goblet squat (tidigare 10)" eller "45 sek side plank (tidigare 32)".
2. **Vikt-PR** — högsta vikt någonsin loggad i den övningen, oavsett value. T.ex. "Du lyfte 16 kg goblet squat för första gången (8 reps)".

För `perSide`-övningar (enarms-, enbensövningar) räknas vänster och höger sida som separata PR-spår.

**Detektion:** Kör som en query klientsidan efter att en set sparats. Inget separat `prs`-table — beräknas on-the-fly. PR-funktionen slår upp övningens `unit` (reps/seconds) från plan-data för att formatera meddelandet rätt.

```typescript
// src/lib/workout/pr.ts (skiss)
export interface PRCheck {
  type: 'value_pr' | 'weight_pr';
  exerciseKey: ExerciseKey;
  side: 'left' | 'right' | null;
  value: number;                    // reps eller sekunder
  weightKg: number | null;
  unit: ExerciseUnit;               // för UI-formatering
  previousBest?: { value: number; weightKg: number | null };
}

// Kallas efter varje sparad set; returnerar PRCheck om PR detekterats
export async function checkForPR(set: SessionSet): Promise<PRCheck | null>;
```

**UI vid PR:** En diskret toast/banner — guldfärgad pulse + serif-text, kort animation. Försvinner efter några sekunder. Inga emojis i UI:t per default (matchar Nicoles japandi-estetik).

**Progressionsgraf på `/workout/exercise/[slug]`:**

- Egen SVG-komponent (`<ProgressionChart>`) — ingen extern diagram-dependency
- X-axel: datum (sessions där övningen gjorts), tidsfönster togglebart (4 v / 12 v / allt)
- Y-axel: togglebart mellan tre vyer
  - **Bästa set** (default): max reps på tyngsta vikt per session
  - **Total volym**: summa av reps × vikt i sessionen
  - **Tyngsta vikt**: max weight_kg i sessionen
- Under grafen: PR-badge (om finns) + chronologisk historik-lista över alla sessioner med just den övningen
- Tomt state: "Logga ditt första pass för att börja se progression."

**Samlad PR-vy:** På `/workout` (startskärmen) en "Senaste rekord"-sektion med de 3 senaste PR:erna över alla övningar.

## Estetik & UI

Workout-tracker:n ska visuellt smälta in i nicoleboman.se men ha en distinkt sport/mobil-känsla. Riktlinjer:

- **Färger:** Reuse Nicoles existerande Tailwind-tema. Action-färg ("Starta passet", PR) — varm guld/orange, inspirerat av `--accent: #c87a2e` från befintliga workout-HTML:en.
- **Typografi:** Fraunces (serif, display) för rubriker och PR-meddelanden. Instrument Sans / Inter för body.
- **Estetik:** Japandi + subtil futurism + varma färger (matchar Nicoles preferens). Mycket whitespace, mjuka shadow, inga tunga gradients (förutom hero-banner).
- **Komponentbibliotek:** ingen — egna Svelte-komponenter med Tailwind utility classes.
- **Ikoner:** lucide-svelte (lättviktigt, matchar minimal estetik).
- **Animation:** sparsamt och meningsfullt — set-completion grön puls, PR gold puls, vilo-timer count.

## Auth, säkerhet och deploy

**Auth (Supabase Auth):**
- En enda registered user (Nicole). Skapad manuellt i Supabase dashboard, inget publikt signup-flöde.
- Email + lösenord. Sessioner default 1h med auto-refresh — håller dig inloggad i veckor i praktiken.
- "Kom ihåg mig" på som default.

**Säkerhet:**
- RLS-policies (`user_id = auth.uid()`) på `sessions` och `session_sets`
- HTTPS via Vercel (default)
- Inga server-side service role keys i klienten
- `.env` med `PUBLIC_SUPABASE_URL` + `PUBLIC_SUPABASE_ANON_KEY`

**PWA:**
- `manifest.webmanifest` med ikoner, theme color, display: standalone
- Service worker med basic offline-caching av plan-data och statiska assets
- "Add to Home Screen"-prompt (icke-påträngande)

**Deploy:**
- Existerande Vercel-projekt för nicoleboman.se. Push till main → auto-deploy. `/workout/*` blir live på `nicoleboman.se/workout`.
- Migrations som SQL-filer i `projects/nicoleboman.se/supabase/migrations/`, körs i Supabase dashboard första gången.
- Inget separat repo, ingen separat hosting.

## Implementation-faser

Föreslagen ordning för implementation. Varje fas ska producera något som fungerar.

**Fas 1 — Foundation**
- Supabase-projekt setup, env-vars, migrations applied
- Plan-data i `src/lib/workout/plan.ts` (alla 5 pass + warm-up + mobility-pool)
- Auth-flow: `/workout/login` + skydd via `+layout.server.ts`
- Tom `/workout`-startskärm som verifierar att auth funkar

**Fas 2 — Core loggning**
- `/workout`-startskärm visar dagens föreslagna pass + andra pass-knappar
- Skapa session vid "Starta passet"
- `/workout/session/[passId]`-vyn: render plan-övningar, set-rader, auto-spara, auto-completion, "Avsluta passet"
- Pågående pass-detektion på startskärmen

**Fas 3 — Live-features**
- Vilo-timer (med ljud + vibration)
- Wake Lock API
- Anteckningsfält per pass

**Fas 4 — Historik + analys**
- `/workout/history`-listan
- `/workout/exercise/[slug]` med historik-lista
- Progressionsgraf-komponent
- PR-detektion + toast

**Fas 5 — Plan-referens & polish**
- `/workout/plan` (statisk referensvy adapterad från Nicoles HTML)
- "Senaste PR"-sektion på startskärmen
- PWA-stöd: manifest + service worker

## Öppna frågor / framtida overväganden

- **Substitutions-UI:** om Nicole vill kunna säga "byt goblet squat mot reverse lunges" mitt i passet utan att skriva i fritextfält → bygg en lättvikt övnings-väljare. Bevaka behovet under första 4 veckorna av användning.
- **Benchmark-test-flöde:** skip:at för MVP, men planen rekommenderar tester var 4:e vecka. Om Nicole vill ha ett guidat test-flöde — separat spec.
- **Appearance tracking** (vikt veckovis, mått, foton): planens "optional"-del. Skip:at från MVP. Eventuell separat feature senare.
- **Daily mobility-tracking:** Idag bara plan-referens. Vill Nicole tracka "gjorde dagens 5–10 min mobility?" → enkel check-in på startskärmen. Bevaka.
- **Saturday EMOM som "klar/ej klar":** ska EMOM ha samma loggnings-vy som strength-pass, eller mer summary-stil ("klar, så här kändes det")? För nu: samma loggnings-vy.
- **Tidszons-hantering:** allt UTC i databasen, format till svensk lokal tid i UI med dayjs. Testa runt midnatt.
