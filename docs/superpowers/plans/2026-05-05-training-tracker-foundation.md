# Training Tracker — Foundation + Core Strength Logging Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bygg ett fungerande MVP av workout-tracker:n på `nicoleboman.se/workout` som låter Nicole logga ett strength-pass (Strength A/B/C) end-to-end på mobilen, med auth, plan-data och Supabase-persistens.

**Architecture:** Ny route-grupp `/workout/*` i existerande SvelteKit-sajten. Plan-data hårdkodad som TypeScript-konstanter. Två Supabase-tabeller (`sessions`, `session_sets`) bakom RLS. Auth via Supabase email+lösenord. Auto-spara med debounce. Estetiken återanvänder existerande paper/sand/stone/sage/wine-tema.

**Tech Stack:** SvelteKit 2 + Svelte 5 (runes) + TypeScript strict + Tailwind v4 + Supabase Auth/Postgres + dayjs + lucide-svelte + vitest (för core-logik).

**Spec-referens:** `docs/superpowers/specs/2026-05-05-training-tracker-design.md`

**Scope för denna plan:** Spec-fas 1 + 2. Allt nedan slutar med en deployad app där du kan logga ett strength-pass komplett. Spec-fas 3 (vilo-timer/wake-lock), 4 (cardio/practice/interval), 5 (historik/grafer/PR) och 6 (plan-referens/PWA) lämnas till uppföljningsplaner.

---

## Filstruktur

Filer som denna plan skapar eller ändrar:

```
projects/nicoleboman.se/
├── package.json                                            (modify: lägg till deps)
├── vitest.config.ts                                        (create)
├── .env.example                                            (create)
├── supabase/
│   └── migrations/
│       └── 0001_workout_sessions.sql                       (create)
├── src/
│   ├── lib/
│   │   ├── supabase.ts                                     (create: client)
│   │   └── workout/
│   │       ├── types.ts                                    (create: PlanExercise, Workout, etc.)
│   │       ├── plan.ts                                     (create: WORKOUTS, WEEKLY_SCHEDULE)
│   │       ├── plan.test.ts                                (create: konsistens-tester)
│   │       ├── schedule.ts                                 (create: getPlannedWorkout)
│   │       ├── schedule.test.ts                            (create)
│   │       └── sessions.ts                                 (create: createSession, saveSet, finishSession)
│   └── routes/
│       └── workout/
│           ├── +layout.server.ts                           (create: auth guard)
│           ├── +layout.svelte                              (create: workout-shell)
│           ├── +page.server.ts                             (create: ladda dagens pass + pågående)
│           ├── +page.svelte                                (create: startskärm)
│           ├── login/
│           │   ├── +page.server.ts                         (create: login action)
│           │   └── +page.svelte                            (create: login-formulär)
│           ├── logout/
│           │   └── +server.ts                              (create: logout endpoint)
│           └── session/
│               └── [id]/
│                   ├── +page.server.ts                     (create: ladda session)
│                   ├── +page.svelte                        (create: loggnings-vy)
│                   └── _components/
│                       ├── ExerciseCard.svelte             (create)
│                       └── SetRow.svelte                   (create)
```

**Designprincip:** core-logik (plan, schedule, sessions, types) i `src/lib/workout/` — testbar utan SvelteKit. UI-komponenter i routes/_components. Supabase-client i `src/lib/supabase.ts`.

---

## Förkrav (manuellt arbete för Nicole, INNAN tasks startar)

Detta måste göras en gång manuellt eftersom det inte kan kodas in:

1. **Skapa Supabase-projekt** på supabase.com — välj region eu-north (Stockholm). Notera Project URL och anon key.
2. **Skapa ditt user-konto** i Supabase Dashboard → Authentication → Users → "Add user" → Create new user → email + lösenord. Detta är den enda accounten som kommer existera.
3. **Skapa ny git branch** i projektet:
   ```bash
   cd /Users/nicoleboman/my-workspace/projects/nicoleboman.se
   git checkout -b workout-tracker
   ```

När det är klart, kör tasks nedan i ordning.

---

## Task 1: Lägg till dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Lägg till runtime + dev deps**

Run:
```bash
cd /Users/nicoleboman/my-workspace/projects/nicoleboman.se
npm install @supabase/supabase-js dayjs lucide-svelte
npm install -D vitest @types/node
```

Expected: `package.json` får tre nya `dependencies` och två nya `devDependencies`.

- [ ] **Step 2: Lägg till test-script i package.json**

Modify `package.json` `scripts`-objektet — lägg till:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Verifiera installation**

Run: `npm run check`
Expected: PASS — inga TypeScript-fel.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "Add Supabase, dayjs, lucide-svelte, vitest deps for workout tracker"
```

---

## Task 2: Konfigurera vitest

**Files:**
- Create: `vitest.config.ts`

- [ ] **Step 1: Skapa vitest config**

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.ts'],
    environment: 'node',
    globals: false
  },
  resolve: {
    alias: {
      $lib: new URL('./src/lib', import.meta.url).pathname
    }
  }
});
```

- [ ] **Step 2: Smoke-test att vitest startar**

Skapa temporärt `src/lib/_smoke.test.ts`:
```typescript
import { test, expect } from 'vitest';
test('vitest works', () => { expect(1 + 1).toBe(2); });
```

Run: `npm test`
Expected: PASS, 1 test passed.

- [ ] **Step 3: Ta bort smoke-test**

Run: `rm src/lib/_smoke.test.ts`

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts
git commit -m "Add vitest config for unit tests"
```

---

## Task 3: Skriv migrations-SQL

**Files:**
- Create: `supabase/migrations/0001_workout_sessions.sql`

- [ ] **Step 1: Skapa migrations-fil**

Create `supabase/migrations/0001_workout_sessions.sql`:
```sql
-- Pass-loggar
create table public.sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  workout_key     text not null,
  planned_key     text not null,
  started_at      timestamptz not null default now(),
  completed_at    timestamptz,
  notes           text,
  duration_min    int,
  activity_type   text,
  created_at      timestamptz not null default now()
);

create index sessions_user_started_idx
  on public.sessions(user_id, started_at desc);

-- Set-loggar (bara för kind=strength)
create table public.session_sets (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid not null references public.sessions(id) on delete cascade,
  user_id        uuid not null references auth.users(id) on delete cascade,
  exercise_key   text not null,
  set_number     int  not null,
  side           text check (side in ('left', 'right') or side is null),
  value          int  not null,
  weight_kg      numeric(5,2),
  rir            int check (rir >= 0 and rir <= 5),
  logged_at      timestamptz not null default now()
);

create index session_sets_session_idx
  on public.session_sets(session_id);

create index session_sets_user_exercise_idx
  on public.session_sets(user_id, exercise_key, logged_at desc);

-- RLS
alter table public.sessions enable row level security;
alter table public.session_sets enable row level security;

create policy "Own sessions"
  on public.sessions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Own session_sets"
  on public.session_sets
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

- [ ] **Step 2: Kör migrationen i Supabase Dashboard**

Detta är ett manuellt steg:
1. Öppna ditt Supabase-projekt
2. SQL Editor → New Query
3. Klistra in hela innehållet från filen ovan
4. Run

Expected: "Success. No rows returned." Tabellerna `sessions` och `session_sets` syns nu i Table Editor.

- [ ] **Step 3: Verifiera RLS via Table Editor**

I Supabase Dashboard → Table Editor → sessions → ska visa "RLS enabled" badge. Samma för session_sets.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0001_workout_sessions.sql
git commit -m "Add Supabase migration for workout sessions and sets"
```

---

## Task 4: Setup env-vars och Supabase-client

**Files:**
- Create: `.env.example`
- Create: `.env` (gitignored)
- Create: `src/lib/supabase.ts`
- Modify: `.gitignore` (verifiera att .env är ignorerad)

- [ ] **Step 1: Skapa .env.example**

Create `.env.example`:
```
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 2: Skapa .env med riktiga värden**

Create `.env` (kopiera från Supabase Dashboard → Project Settings → API):
```
PUBLIC_SUPABASE_URL=<din-url>
PUBLIC_SUPABASE_ANON_KEY=<din-anon-key>
```

- [ ] **Step 3: Verifiera att .env är gitignored**

Run: `git check-ignore .env`
Expected: utskrift `.env` (= ignorerad). Om inget skrivs ut, lägg till `.env` i `.gitignore` och commit.

- [ ] **Step 4: Skapa Supabase-client**

Create `src/lib/supabase.ts`:
```typescript
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase: SupabaseClient = createClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);
```

- [ ] **Step 5: Verifiera att type-check går igenom**

Run: `npm run check`
Expected: PASS — inga TypeScript-fel.

- [ ] **Step 6: Commit**

```bash
git add .env.example src/lib/supabase.ts .gitignore
git commit -m "Add Supabase client and env-var template"
```

---

## Task 5: Plan-data — typer

**Files:**
- Create: `src/lib/workout/types.ts`

- [ ] **Step 1: Skapa types-filen**

Create `src/lib/workout/types.ts`:
```typescript
export type Weekday =
  | 'monday' | 'tuesday' | 'wednesday' | 'thursday'
  | 'friday' | 'saturday' | 'sunday';

export type WorkoutKind = 'strength' | 'cardio' | 'practice' | 'interval';

export type ExerciseUnit = 'reps' | 'seconds';

export type WorkoutKey =
  | 'strength_a'
  | 'strength_b'
  | 'strength_c'
  | 'cardio_z2'
  | 'active_recovery'
  | 'emom';

export type ExerciseKey =
  // Strength A
  | 'goblet_squat'
  | 'push_up'
  | 'kb_press_half_kneeling'
  | 'double_kb_rdl'
  | 'kb_row_supported'
  | 'ytw_raises'
  | 'hollow_body_hold'
  // Strength B
  | 'kb_swing'
  | 'bulgarian_split_squat'
  | 'kb_floor_press'
  | 'kb_halo'
  | 'farmers_carry'
  | 'dead_bug'
  // Strength C
  | 'kb_clean'
  | 'reverse_lunge'
  | 'push_up_controlled'
  | 'single_leg_rdl'
  | 'side_plank'
  | 'suitcase_carry';

export interface PlanExercise {
  key: ExerciseKey;
  name: string;
  unit: ExerciseUnit;
  targetSets: number;
  targetMin: number;
  targetMax: number;
  amrap?: boolean;
  targetWeightKg: number | null;
  loadDescription: string;
  cue: string;
  restSeconds: number;
  perSide?: boolean;
}

export interface Workout {
  key: WorkoutKey;
  kind: WorkoutKind;
  name: string;
  subtitle: string;
  durationMinutes: string;
  exercises: PlanExercise[];
  cardioOptions?: string[];
}
```

- [ ] **Step 2: Verifiera type-check**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/workout/types.ts
git commit -m "Add workout plan types"
```

---

## Task 6: Plan-data — Strength A

**Files:**
- Create: `src/lib/workout/plan.ts`

- [ ] **Step 1: Skapa plan.ts med Strength A**

Create `src/lib/workout/plan.ts`:
```typescript
import type { PlanExercise, Weekday, Workout, WorkoutKey } from './types';

const STRENGTH_A: Workout = {
  key: 'strength_a',
  kind: 'strength',
  name: 'Strength A',
  subtitle: 'Squat & Push',
  durationMinutes: '45–55',
  exercises: [
    {
      key: 'goblet_squat',
      name: 'Goblet squat',
      unit: 'reps',
      targetSets: 4,
      targetMin: 8,
      targetMax: 10,
      targetWeightKg: 12,
      loadDescription: '12 kg KB',
      cue: 'Tempo 3-1-1. Tre sekunder ner, ett-sekunds paus, kör upp.',
      restSeconds: 90
    },
    {
      key: 'push_up',
      name: 'Push-up',
      unit: 'reps',
      targetSets: 3,
      targetMin: 1,
      targetMax: 99,
      amrap: true,
      targetWeightKg: null,
      loadDescription: 'Bodyweight',
      cue: 'Stop 1–2 reps short of failure. Höj fötter på stol när lätt.',
      restSeconds: 90
    },
    {
      key: 'kb_press_half_kneeling',
      name: 'Single-arm KB press',
      unit: 'reps',
      targetSets: 3,
      targetMin: 6,
      targetMax: 8,
      targetWeightKg: 8,
      loadDescription: '8 kg KB',
      cue: 'Half-kneeling. Revben ner, glutes squeezed.',
      restSeconds: 75,
      perSide: true
    },
    {
      key: 'double_kb_rdl',
      name: 'Double KB Romanian deadlift',
      unit: 'reps',
      targetSets: 4,
      targetMin: 8,
      targetMax: 10,
      targetWeightKg: 12,
      loadDescription: '2× 12 kg KB',
      cue: 'Höfter bak, mjuka knän. Känn hamstrings stretcha.',
      restSeconds: 90
    },
    {
      key: 'kb_row_supported',
      name: 'Single-arm KB row',
      unit: 'reps',
      targetSets: 3,
      targetMin: 8,
      targetMax: 8,
      targetWeightKg: 12,
      loadDescription: '12 kg KB',
      cue: 'Fri hand på stol. Dra armbåge till höft, paus 1 sek överst.',
      restSeconds: 75,
      perSide: true
    },
    {
      key: 'ytw_raises',
      name: 'Prone Y-T-W raises',
      unit: 'reps',
      targetSets: 3,
      targetMin: 8,
      targetMax: 8,
      targetWeightKg: 2,
      loadDescription: '2× 1–2 kg DB',
      cue: 'Liggande på mage. Långsamt, kontrollerat. Squeeze övre rygg, inte nacke.',
      restSeconds: 60
    },
    {
      key: 'hollow_body_hold',
      name: 'Hollow body hold',
      unit: 'seconds',
      targetSets: 3,
      targetMin: 20,
      targetMax: 40,
      targetWeightKg: null,
      loadDescription: 'Bodyweight',
      cue: 'Nedre rygg pressad mot golvet. Korta lever om den lyfts.',
      restSeconds: 60
    }
  ]
};

export const WORKOUTS: Partial<Record<WorkoutKey, Workout>> = {
  strength_a: STRENGTH_A
  // strength_b, strength_c kommer i nästa task
  // cardio_z2, active_recovery, emom kommer i fas 4-plan
};

export const WEEKLY_SCHEDULE: Record<Weekday, WorkoutKey | null> = {
  monday: 'strength_a',
  tuesday: 'cardio_z2',
  wednesday: 'strength_b',
  thursday: 'active_recovery',
  friday: 'strength_c',
  saturday: 'emom',
  sunday: null
};
```

- [ ] **Step 2: Verifiera type-check**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/workout/plan.ts
git commit -m "Add Strength A plan data"
```

---

## Task 7: Plan-data — Strength B + C

**Files:**
- Modify: `src/lib/workout/plan.ts`

- [ ] **Step 1: Lägg till Strength B**

I `src/lib/workout/plan.ts`, lägg till efter `STRENGTH_A`-konstanten:
```typescript
const STRENGTH_B: Workout = {
  key: 'strength_b',
  kind: 'strength',
  name: 'Strength B',
  subtitle: 'Hinge & Pull',
  durationMinutes: '45–55',
  exercises: [
    {
      key: 'kb_swing',
      name: 'KB swing',
      unit: 'reps',
      targetSets: 5,
      targetMin: 12,
      targetMax: 12,
      targetWeightKg: 12,
      loadDescription: '12 kg KB',
      cue: 'Hinge, inte squat. Snäpp höfterna. KB flyter till brösthöjd.',
      restSeconds: 90
    },
    {
      key: 'bulgarian_split_squat',
      name: 'Bulgarian split squat',
      unit: 'reps',
      targetSets: 3,
      targetMin: 8,
      targetMax: 8,
      targetWeightKg: 8,
      loadDescription: '8 kg goblet',
      cue: 'Tempo 3-1-1. Bakfot på stol. Fram-skenben nästan vertikalt.',
      restSeconds: 90,
      perSide: true
    },
    {
      key: 'kb_row_supported',
      name: 'Single-arm KB row',
      unit: 'reps',
      targetSets: 4,
      targetMin: 8,
      targetMax: 8,
      targetWeightKg: 12,
      loadDescription: '12 kg KB',
      cue: 'Hand på stol för stöd. Dra armbåge till höft, paus 1 sek.',
      restSeconds: 75,
      perSide: true
    },
    {
      key: 'kb_floor_press',
      name: 'KB floor press',
      unit: 'reps',
      targetSets: 3,
      targetMin: 10,
      targetMax: 10,
      targetWeightKg: 8,
      loadDescription: '8 kg KB',
      cue: 'Långsam kontroll. Triceps tar i golvet innan du pressar upp.',
      restSeconds: 75,
      perSide: true
    },
    {
      key: 'kb_halo',
      name: 'KB halo',
      unit: 'reps',
      targetSets: 3,
      targetMin: 5,
      targetMax: 5,
      targetWeightKg: 8,
      loadDescription: '8 kg KB',
      cue: 'Tight cirkel runt huvudet. Bracha core — låt inte ryggen svaja.',
      restSeconds: 60
    },
    {
      key: 'farmers_carry',
      name: "Farmer's carry",
      unit: 'seconds',
      targetSets: 3,
      targetMin: 30,
      targetMax: 30,
      targetWeightKg: 12,
      loadDescription: '2× 12 kg KB',
      cue: 'Lång hållning. Axlar ner och bak. Gå långsamt.',
      restSeconds: 75
    },
    {
      key: 'dead_bug',
      name: 'Dead bug',
      unit: 'reps',
      targetSets: 3,
      targetMin: 8,
      targetMax: 8,
      targetWeightKg: null,
      loadDescription: 'Bodyweight',
      cue: 'Nedre rygg platt mot golvet. Rör motsatt arm och ben långsamt.',
      restSeconds: 60,
      perSide: true
    }
  ]
};
```

- [ ] **Step 2: Lägg till Strength C**

Lägg till efter `STRENGTH_B`:
```typescript
const STRENGTH_C: Workout = {
  key: 'strength_c',
  kind: 'strength',
  name: 'Strength C',
  subtitle: 'Power & Unilateral',
  durationMinutes: '45–55',
  exercises: [
    {
      key: 'kb_clean',
      name: 'KB clean',
      unit: 'reps',
      targetSets: 4,
      targetMin: 5,
      targetMax: 5,
      targetWeightKg: 12,
      loadDescription: '8–12 kg KB',
      cue: 'Hike mellan benen, snäpp höfter, fånga i front rack. Curla inte.',
      restSeconds: 90,
      perSide: true
    },
    {
      key: 'reverse_lunge',
      name: 'Reverse lunge',
      unit: 'reps',
      targetSets: 3,
      targetMin: 8,
      targetMax: 8,
      targetWeightKg: 8,
      loadDescription: '8 kg goblet',
      cue: 'Steg bak, sänk knät mjukt, kör genom främre häl. Tempo 3-1-1.',
      restSeconds: 90,
      perSide: true
    },
    {
      key: 'push_up_controlled',
      name: 'Push-up (controlled)',
      unit: 'reps',
      targetSets: 3,
      targetMin: 8,
      targetMax: 12,
      targetWeightKg: null,
      loadDescription: 'Bodyweight',
      cue: 'Långsam 3-sekunders sänkning. Höj fötter på stol när lätt.',
      restSeconds: 75
    },
    {
      key: 'single_leg_rdl',
      name: 'Single-leg Romanian deadlift',
      unit: 'reps',
      targetSets: 3,
      targetMin: 8,
      targetMax: 8,
      targetWeightKg: 12,
      loadDescription: '12 kg KB',
      cue: 'Fri hand sträcker fram när KB-sidans ben lyfts bak. Långsamt.',
      restSeconds: 90,
      perSide: true
    },
    {
      key: 'kb_row_supported',
      name: 'Single-arm KB row',
      unit: 'reps',
      targetSets: 3,
      targetMin: 10,
      targetMax: 10,
      targetWeightKg: 12,
      loadDescription: '12 kg KB',
      cue: 'Samma som onsdag. Att förstärka mönstret är poängen.',
      restSeconds: 75,
      perSide: true
    },
    {
      key: 'side_plank',
      name: 'Side plank',
      unit: 'seconds',
      targetSets: 3,
      targetMin: 30,
      targetMax: 30,
      targetWeightKg: null,
      loadDescription: 'Bodyweight',
      cue: 'Stacka höfterna. Låt dem inte droppa. Andas.',
      restSeconds: 60,
      perSide: true
    },
    {
      key: 'suitcase_carry',
      name: 'Suitcase carry',
      unit: 'seconds',
      targetSets: 3,
      targetMin: 30,
      targetMax: 30,
      targetWeightKg: 12,
      loadDescription: '12 kg KB',
      cue: 'En sida — anti-lateral-flexion. Låt inte den lastade sidan dra dig ner.',
      restSeconds: 75,
      perSide: true
    }
  ]
};
```

- [ ] **Step 3: Uppdatera WORKOUTS-objektet**

Byt ut det tomma `WORKOUTS`-objektet mot:
```typescript
export const WORKOUTS: Partial<Record<WorkoutKey, Workout>> = {
  strength_a: STRENGTH_A,
  strength_b: STRENGTH_B,
  strength_c: STRENGTH_C
  // cardio_z2, active_recovery, emom — kommer i fas 4-plan
};
```

- [ ] **Step 4: Verifiera**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/workout/plan.ts
git commit -m "Add Strength B and C plan data"
```

---

## Task 8: Plan-konsistens-tester

**Files:**
- Create: `src/lib/workout/plan.test.ts`

- [ ] **Step 1: Skriv konsistens-tester**

Create `src/lib/workout/plan.test.ts`:
```typescript
import { test, expect, describe } from 'vitest';
import { WORKOUTS } from './plan';
import type { Workout } from './types';

describe('strength workouts', () => {
  const strengthKeys = ['strength_a', 'strength_b', 'strength_c'] as const;

  for (const key of strengthKeys) {
    describe(key, () => {
      const workout: Workout | undefined = WORKOUTS[key];

      test('exists', () => {
        expect(workout).toBeDefined();
      });

      test('has kind=strength', () => {
        expect(workout!.kind).toBe('strength');
      });

      test('has at least 5 exercises', () => {
        expect(workout!.exercises.length).toBeGreaterThanOrEqual(5);
      });

      test('every exercise has positive targetSets', () => {
        for (const ex of workout!.exercises) {
          expect(ex.targetSets, ex.name).toBeGreaterThan(0);
        }
      });

      test('every exercise has targetMin <= targetMax', () => {
        for (const ex of workout!.exercises) {
          expect(ex.targetMin, ex.name).toBeLessThanOrEqual(ex.targetMax);
        }
      });

      test('every exercise has restSeconds >= 30', () => {
        for (const ex of workout!.exercises) {
          expect(ex.restSeconds, ex.name).toBeGreaterThanOrEqual(30);
        }
      });

      test('every exercise has a non-empty cue', () => {
        for (const ex of workout!.exercises) {
          expect(ex.cue.length, ex.name).toBeGreaterThan(10);
        }
      });
    });
  }
});
```

- [ ] **Step 2: Kör tester**

Run: `npm test`
Expected: alla tester PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/workout/plan.test.ts
git commit -m "Add strength plan consistency tests"
```

---

## Task 9: Schedule-logik

**Files:**
- Create: `src/lib/workout/schedule.ts`
- Create: `src/lib/workout/schedule.test.ts`

- [ ] **Step 1: Skriv failing test för weekday-from-date**

Create `src/lib/workout/schedule.test.ts`:
```typescript
import { test, expect, describe } from 'vitest';
import { weekdayFromDate, getPlannedWorkout } from './schedule';

describe('weekdayFromDate', () => {
  test('måndag 2026-05-04', () => {
    expect(weekdayFromDate(new Date('2026-05-04T10:00:00'))).toBe('monday');
  });
  test('tisdag 2026-05-05', () => {
    expect(weekdayFromDate(new Date('2026-05-05T10:00:00'))).toBe('tuesday');
  });
  test('söndag 2026-05-10', () => {
    expect(weekdayFromDate(new Date('2026-05-10T10:00:00'))).toBe('sunday');
  });
});

describe('getPlannedWorkout', () => {
  test('måndag → strength_a', () => {
    expect(getPlannedWorkout(new Date('2026-05-04T10:00:00'))).toBe('strength_a');
  });
  test('onsdag → strength_b', () => {
    expect(getPlannedWorkout(new Date('2026-05-06T10:00:00'))).toBe('strength_b');
  });
  test('fredag → strength_c', () => {
    expect(getPlannedWorkout(new Date('2026-05-08T10:00:00'))).toBe('strength_c');
  });
  test('söndag → null (vila)', () => {
    expect(getPlannedWorkout(new Date('2026-05-10T10:00:00'))).toBeNull();
  });
});
```

- [ ] **Step 2: Kör test, verifiera fail**

Run: `npm test`
Expected: FAIL — `Cannot find module './schedule'`.

- [ ] **Step 3: Implementera schedule.ts**

Create `src/lib/workout/schedule.ts`:
```typescript
import type { Weekday, WorkoutKey } from './types';
import { WEEKLY_SCHEDULE } from './plan';

const WEEKDAYS: Weekday[] = [
  'sunday', 'monday', 'tuesday', 'wednesday',
  'thursday', 'friday', 'saturday'
];

export function weekdayFromDate(date: Date): Weekday {
  return WEEKDAYS[date.getDay()];
}

export function getPlannedWorkout(date: Date): WorkoutKey | null {
  return WEEKLY_SCHEDULE[weekdayFromDate(date)];
}
```

- [ ] **Step 4: Kör test, verifiera pass**

Run: `npm test`
Expected: alla tester PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/workout/schedule.ts src/lib/workout/schedule.test.ts
git commit -m "Add schedule logic with weekday→workout mapping"
```

---

## Task 10: Sessions-helpers

**Files:**
- Create: `src/lib/workout/sessions.ts`

- [ ] **Step 1: Skapa sessions helpers**

Create `src/lib/workout/sessions.ts`:
```typescript
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ExerciseKey, WorkoutKey } from './types';

export interface SessionRow {
  id: string;
  user_id: string;
  workout_key: WorkoutKey;
  planned_key: WorkoutKey;
  started_at: string;
  completed_at: string | null;
  notes: string | null;
  duration_min: number | null;
  activity_type: string | null;
  created_at: string;
}

export interface SessionSetRow {
  id: string;
  session_id: string;
  user_id: string;
  exercise_key: ExerciseKey;
  set_number: number;
  side: 'left' | 'right' | null;
  value: number;
  weight_kg: number | null;
  rir: number | null;
  logged_at: string;
}

export interface SetUpsertInput {
  session_id: string;
  user_id: string;
  exercise_key: ExerciseKey;
  set_number: number;
  side: 'left' | 'right' | null;
  value: number;
  weight_kg: number | null;
  rir: number | null;
}

export async function createSession(
  client: SupabaseClient,
  userId: string,
  workoutKey: WorkoutKey,
  plannedKey: WorkoutKey
): Promise<SessionRow> {
  const { data, error } = await client
    .from('sessions')
    .insert({
      user_id: userId,
      workout_key: workoutKey,
      planned_key: plannedKey
    })
    .select()
    .single();
  if (error) throw error;
  return data as SessionRow;
}

export async function getActiveSession(
  client: SupabaseClient,
  userId: string
): Promise<SessionRow | null> {
  const { data, error } = await client
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .is('completed_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as SessionRow) ?? null;
}

export async function getSession(
  client: SupabaseClient,
  sessionId: string
): Promise<SessionRow | null> {
  const { data, error } = await client
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .maybeSingle();
  if (error) throw error;
  return (data as SessionRow) ?? null;
}

export async function getSessionSets(
  client: SupabaseClient,
  sessionId: string
): Promise<SessionSetRow[]> {
  const { data, error } = await client
    .from('session_sets')
    .select('*')
    .eq('session_id', sessionId)
    .order('set_number', { ascending: true });
  if (error) throw error;
  return (data as SessionSetRow[]) ?? [];
}

export async function upsertSet(
  client: SupabaseClient,
  input: SetUpsertInput
): Promise<SessionSetRow> {
  // Vi använder unique-key (session_id, exercise_key, set_number, side)
  // för dedup. Eftersom vi inte har en unique constraint i DB för det,
  // gör vi en manuell select-then-update-or-insert.
  const { data: existing, error: selectError } = await client
    .from('session_sets')
    .select('id')
    .eq('session_id', input.session_id)
    .eq('exercise_key', input.exercise_key)
    .eq('set_number', input.set_number)
    .is('side', input.side)   // null-safe equality
    .maybeSingle();
  if (selectError) throw selectError;

  if (existing) {
    const { data, error } = await client
      .from('session_sets')
      .update({
        value: input.value,
        weight_kg: input.weight_kg,
        rir: input.rir,
        logged_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data as SessionSetRow;
  }

  const { data, error } = await client
    .from('session_sets')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as SessionSetRow;
}

export async function deleteSet(
  client: SupabaseClient,
  setId: string
): Promise<void> {
  const { error } = await client
    .from('session_sets')
    .delete()
    .eq('id', setId);
  if (error) throw error;
}

export async function finishSession(
  client: SupabaseClient,
  sessionId: string,
  notes: string | null
): Promise<void> {
  const { error } = await client
    .from('sessions')
    .update({
      completed_at: new Date().toISOString(),
      notes: notes && notes.trim().length > 0 ? notes : null
    })
    .eq('id', sessionId);
  if (error) throw error;
}

export async function updateSessionNotes(
  client: SupabaseClient,
  sessionId: string,
  notes: string | null
): Promise<void> {
  const { error } = await client
    .from('sessions')
    .update({ notes: notes && notes.trim().length > 0 ? notes : null })
    .eq('id', sessionId);
  if (error) throw error;
}
```

- [ ] **Step 2: Verifiera type-check**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/workout/sessions.ts
git commit -m "Add Supabase session/set helpers"
```

---

## Task 11: Auth-skydd via +layout.server.ts

**Files:**
- Create: `src/routes/workout/+layout.server.ts`

- [ ] **Step 1: Skapa auth-guard**

Create `src/routes/workout/+layout.server.ts`:
```typescript
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load: LayoutServerLoad = async ({ url, cookies }) => {
  const supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookies.getAll(),
        setAll: (toSet) => {
          for (const { name, value, options } of toSet) {
            cookies.set(name, value, { ...options, path: '/' });
          }
        }
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Tillåt /workout/login utan auth
  if (!user && !url.pathname.startsWith('/workout/login')) {
    throw redirect(303, '/workout/login');
  }

  // Om inloggad och försöker nå login → till startskärm
  if (user && url.pathname.startsWith('/workout/login')) {
    throw redirect(303, '/workout');
  }

  return {
    user: user ? { id: user.id, email: user.email } : null
  };
};
```

- [ ] **Step 2: Lägg till @supabase/ssr**

Run:
```bash
cd /Users/nicoleboman/my-workspace/projects/nicoleboman.se
npm install @supabase/ssr
```

- [ ] **Step 3: Verifiera type-check**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/routes/workout/+layout.server.ts package.json package-lock.json
git commit -m "Add auth guard for /workout routes"
```

---

## Task 12: Login-sida

**Files:**
- Create: `src/routes/workout/login/+page.server.ts`
- Create: `src/routes/workout/login/+page.svelte`

- [ ] **Step 1: Skapa login server actions**

Create `src/routes/workout/login/+page.server.ts`:
```typescript
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    if (!email || !password) {
      return fail(400, { error: 'Fyll i båda fälten.', email });
    }

    const supabase = createServerClient(
      PUBLIC_SUPABASE_URL,
      PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll: () => cookies.getAll(),
          setAll: (toSet) => {
            for (const { name, value, options } of toSet) {
              cookies.set(name, value, { ...options, path: '/' });
            }
          }
        }
      }
    );

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return fail(401, { error: 'Fel email eller lösenord.', email });
    }

    throw redirect(303, '/workout');
  }
};
```

- [ ] **Step 2: Skapa login-formuläret**

Create `src/routes/workout/login/+page.svelte`:
```svelte
<script lang="ts">
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
  <title>Workout — Logga in</title>
</svelte:head>

<div class="mx-auto max-w-sm py-20 px-6">
  <h1 class="font-display text-3xl font-medium tracking-tight text-ink mb-8">
    Workout
  </h1>

  <form method="POST" class="space-y-4">
    <label class="block">
      <span class="block text-sm text-stone mb-1">Email</span>
      <input
        type="email"
        name="email"
        required
        autocomplete="email"
        value={form?.email ?? ''}
        class="w-full bg-sand border border-line rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-stone"
      />
    </label>

    <label class="block">
      <span class="block text-sm text-stone mb-1">Lösenord</span>
      <input
        type="password"
        name="password"
        required
        autocomplete="current-password"
        class="w-full bg-sand border border-line rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-stone"
      />
    </label>

    {#if form?.error}
      <p class="text-sm text-wine">{form.error}</p>
    {/if}

    <button
      type="submit"
      class="w-full bg-ink text-paper rounded-lg py-2.5 font-medium hover:opacity-90 transition"
    >
      Logga in
    </button>
  </form>
</div>
```

- [ ] **Step 3: Manuell smoke-test**

Run: `npm run dev`
Öppna: `http://localhost:5173/workout/login`
Expected: Login-formuläret syns. Försök logga in med din email/lösenord från Supabase. Vid lyckad login → redirect till `/workout` (som ger 404 nu — det är OK, vi bygger den i Task 13).

- [ ] **Step 4: Commit**

```bash
git add src/routes/workout/login/
git commit -m "Add workout login page with Supabase auth"
```

---

## Task 13: Logout-endpoint + workout-shell

**Files:**
- Create: `src/routes/workout/logout/+server.ts`
- Create: `src/routes/workout/+layout.svelte`

- [ ] **Step 1: Skapa logout endpoint**

Create `src/routes/workout/logout/+server.ts`:
```typescript
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const POST: RequestHandler = async ({ cookies }) => {
  const supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookies.getAll(),
        setAll: (toSet) => {
          for (const { name, value, options } of toSet) {
            cookies.set(name, value, { ...options, path: '/' });
          }
        }
      }
    }
  );

  await supabase.auth.signOut();
  throw redirect(303, '/workout/login');
};
```

- [ ] **Step 2: Skapa workout-shell-layout**

Create `src/routes/workout/+layout.svelte`:
```svelte
<script lang="ts">
  import type { LayoutData } from './$types';
  import { page } from '$app/state';

  let { data, children }: { data: LayoutData; children: any } = $props();

  let isLogin = $derived(page.url.pathname.startsWith('/workout/login'));
</script>

<div class="min-h-screen bg-paper text-ink">
  {#if !isLogin && data.user}
    <header class="border-b border-line px-4 py-3 flex items-center justify-between">
      <a href="/workout" class="font-display text-lg font-medium tracking-tight">
        Workout
      </a>
      <form method="POST" action="/workout/logout">
        <button type="submit" class="text-sm text-stone hover:text-ink transition">
          Logga ut
        </button>
      </form>
    </header>
  {/if}

  {@render children()}
</div>
```

- [ ] **Step 3: Manuell test**

Run: `npm run dev` (om inte igång)
1. Logga in
2. Du ska se header med "Workout" och "Logga ut"
3. Klicka logga ut → tillbaka till login
4. Försök gå till `/workout` utloggad → redirect till login

Expected: alla tre fungerar.

- [ ] **Step 4: Commit**

```bash
git add src/routes/workout/logout/ src/routes/workout/+layout.svelte
git commit -m "Add workout shell layout and logout endpoint"
```

---

## Task 14: Startskärm — load dagens pass + pågående

**Files:**
- Create: `src/routes/workout/+page.server.ts`

- [ ] **Step 1: Skapa server-loader**

Create `src/routes/workout/+page.server.ts`:
```typescript
import type { PageServerLoad, Actions } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { getActiveSession, createSession } from '$lib/workout/sessions';
import { getPlannedWorkout } from '$lib/workout/schedule';
import { WORKOUTS } from '$lib/workout/plan';
import type { WorkoutKey } from '$lib/workout/types';
import { error, redirect } from '@sveltejs/kit';

function makeServerClient(cookies: any) {
  return createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookies.getAll(),
        setAll: (toSet: any[]) => {
          for (const { name, value, options } of toSet) {
            cookies.set(name, value, { ...options, path: '/' });
          }
        }
      }
    }
  );
}

export const load: PageServerLoad = async ({ cookies, parent }) => {
  const { user } = await parent();
  if (!user) throw redirect(303, '/workout/login');

  const supabase = makeServerClient(cookies);
  const active = await getActiveSession(supabase, user.id);

  const plannedKey = getPlannedWorkout(new Date());
  const planned = plannedKey ? (WORKOUTS[plannedKey] ?? null) : null;

  // Lista alla strength-pass som overrides
  const allWorkouts = Object.values(WORKOUTS).filter(w => w.kind === 'strength');

  return {
    activeSession: active,
    plannedKey,
    planned: planned ? { key: planned.key, name: planned.name, subtitle: planned.subtitle } : null,
    allWorkouts: allWorkouts.map(w => ({ key: w.key, name: w.name, subtitle: w.subtitle }))
  };
};

export const actions: Actions = {
  start: async ({ request, cookies, parent }) => {
    const { user } = await parent();
    if (!user) throw redirect(303, '/workout/login');

    const formData = await request.formData();
    const workoutKey = formData.get('workout_key') as WorkoutKey | null;
    const plannedKeyForm = (formData.get('planned_key') ?? workoutKey) as WorkoutKey | null;

    if (!workoutKey || !(workoutKey in WORKOUTS)) {
      throw error(400, 'Okänt pass');
    }

    const supabase = makeServerClient(cookies);
    const session = await createSession(
      supabase,
      user.id,
      workoutKey,
      plannedKeyForm ?? workoutKey
    );

    throw redirect(303, `/workout/session/${session.id}`);
  }
};
```

> **Notera:** `parent()` i `actions` returnerar inte data från `+layout.server.ts` på samma sätt som i `load`. För actions: hämta user direkt via `supabase.auth.getUser()` i action. Fixar i nästa step.

- [ ] **Step 2: Fixa user-hämtning i actions**

Ersätt `actions`-objektet i samma fil med:
```typescript
export const actions: Actions = {
  start: async ({ request, cookies }) => {
    const supabase = makeServerClient(cookies);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect(303, '/workout/login');

    const formData = await request.formData();
    const workoutKey = formData.get('workout_key') as WorkoutKey | null;
    const plannedKeyForm = (formData.get('planned_key') ?? workoutKey) as WorkoutKey | null;

    if (!workoutKey || !(workoutKey in WORKOUTS)) {
      throw error(400, 'Okänt pass');
    }

    const session = await createSession(
      supabase,
      user.id,
      workoutKey,
      plannedKeyForm ?? workoutKey
    );

    throw redirect(303, `/workout/session/${session.id}`);
  }
};
```

- [ ] **Step 3: Verifiera type-check**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/routes/workout/+page.server.ts
git commit -m "Add startskärm loader with planned workout and active session"
```

---

## Task 15: Startskärm — UI

**Files:**
- Create: `src/routes/workout/+page.svelte`

- [ ] **Step 1: Skapa startskärmen**

Create `src/routes/workout/+page.svelte`:
```svelte
<script lang="ts">
  import type { PageData } from './$types';
  import { enhance } from '$app/forms';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Workout</title>
</svelte:head>

<main class="mx-auto max-w-md px-4 py-6 space-y-8">
  {#if data.activeSession}
    <section class="bg-sand border border-line rounded-2xl p-5">
      <p class="text-sm text-stone mb-1">Pågående pass</p>
      <h2 class="font-display text-2xl font-medium mb-3">
        Du har ett pass igång
      </h2>
      <a
        href="/workout/session/{data.activeSession.id}"
        class="inline-block bg-ink text-paper rounded-lg px-5 py-2.5 font-medium hover:opacity-90 transition"
      >
        Fortsätt passet
      </a>
    </section>
  {:else if data.planned}
    <section>
      <p class="text-sm text-stone mb-1">Idag</p>
      <h2 class="font-display text-3xl font-medium tracking-tight mb-1">
        {data.planned.name}
      </h2>
      <p class="text-stone italic mb-5">{data.planned.subtitle}</p>

      <form method="POST" action="?/start" use:enhance>
        <input type="hidden" name="workout_key" value={data.planned.key} />
        <input type="hidden" name="planned_key" value={data.planned.key} />
        <button
          type="submit"
          class="w-full bg-ink text-paper rounded-lg py-3 font-medium text-lg hover:opacity-90 transition"
        >
          Starta passet
        </button>
      </form>
    </section>
  {:else}
    <section>
      <p class="text-sm text-stone mb-1">Idag</p>
      <h2 class="font-display text-2xl font-medium tracking-tight mb-3">
        Vilodag
      </h2>
      <p class="text-stone">Planen säger vila idag. Välj ändå ett pass nedan om du vill köra.</p>
    </section>
  {/if}

  <section>
    <h3 class="text-sm uppercase tracking-mono text-stone mb-3">Andra pass</h3>
    <div class="space-y-2">
      {#each data.allWorkouts.filter(w => w.key !== data.planned?.key) as workout (workout.key)}
        <form method="POST" action="?/start" use:enhance>
          <input type="hidden" name="workout_key" value={workout.key} />
          {#if data.planned}
            <input type="hidden" name="planned_key" value={data.planned.key} />
          {/if}
          <button
            type="submit"
            class="w-full text-left bg-paper border border-line rounded-lg px-4 py-3 hover:bg-sand transition"
          >
            <span class="font-medium">{workout.name}</span>
            <span class="text-stone italic"> — {workout.subtitle}</span>
          </button>
        </form>
      {/each}
    </div>
  </section>
</main>
```

- [ ] **Step 2: Manuell test**

Run: `npm run dev` (om inte igång)
1. Logga in
2. Du ska se "Idag" + dagens pass enligt veckodag (eller "Vilodag" om söndag)
3. Klick "Starta passet" → redirect till `/workout/session/<id>` (404 nu — vi bygger den i Task 16)

Expected: rätt pass visas för idag, andra strength-pass listade som overrides.

- [ ] **Step 3: Commit**

```bash
git add src/routes/workout/+page.svelte
git commit -m "Add workout startskärm with planned session and overrides"
```

---

## Task 16: Loggnings-vy — server-loader

**Files:**
- Create: `src/routes/workout/session/[id]/+page.server.ts`

- [ ] **Step 1: Skapa server-loader**

Create `src/routes/workout/session/[id]/+page.server.ts`:
```typescript
import type { PageServerLoad, Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import {
  getSession,
  getSessionSets,
  upsertSet,
  finishSession,
  updateSessionNotes
} from '$lib/workout/sessions';
import { WORKOUTS } from '$lib/workout/plan';
import type { ExerciseKey } from '$lib/workout/types';

function makeServerClient(cookies: any) {
  return createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookies.getAll(),
        setAll: (toSet: any[]) => {
          for (const { name, value, options } of toSet) {
            cookies.set(name, value, { ...options, path: '/' });
          }
        }
      }
    }
  );
}

export const load: PageServerLoad = async ({ params, cookies, parent }) => {
  const { user } = await parent();
  if (!user) throw redirect(303, '/workout/login');

  const supabase = makeServerClient(cookies);
  const session = await getSession(supabase, params.id);

  if (!session) throw error(404, 'Pass hittades inte');
  if (session.user_id !== user.id) throw error(403, 'Inte ditt pass');

  const workout = WORKOUTS[session.workout_key];
  if (!workout) throw error(500, `Okänt workout_key: ${session.workout_key}`);

  const sets = await getSessionSets(supabase, session.id);

  return {
    session,
    workout,
    sets
  };
};

export const actions: Actions = {
  upsertSet: async ({ request, params, cookies }) => {
    const supabase = makeServerClient(cookies);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect(303, '/workout/login');

    const form = await request.formData();
    const exerciseKey = String(form.get('exercise_key')) as ExerciseKey;
    const setNumber = Number(form.get('set_number'));
    const sideRaw = String(form.get('side') ?? '');
    const side = (sideRaw === 'left' || sideRaw === 'right') ? sideRaw : null;
    const value = Number(form.get('value'));
    const weightRaw = String(form.get('weight_kg') ?? '');
    const weight_kg = weightRaw === '' ? null : Number(weightRaw);
    const rirRaw = String(form.get('rir') ?? '');
    const rir = rirRaw === '' ? null : Number(rirRaw);

    if (!Number.isFinite(value) || value <= 0) {
      return { ok: false, error: 'value måste vara > 0' };
    }

    const updated = await upsertSet(supabase, {
      session_id: params.id,
      user_id: user.id,
      exercise_key: exerciseKey,
      set_number: setNumber,
      side,
      value,
      weight_kg: Number.isFinite(weight_kg as number) ? (weight_kg as number) : null,
      rir: Number.isFinite(rir as number) ? (rir as number) : null
    });

    return { ok: true, set: updated };
  },

  saveNotes: async ({ request, params, cookies }) => {
    const supabase = makeServerClient(cookies);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect(303, '/workout/login');

    const form = await request.formData();
    const notes = String(form.get('notes') ?? '');
    await updateSessionNotes(supabase, params.id, notes);
    return { ok: true };
  },

  finish: async ({ request, params, cookies }) => {
    const supabase = makeServerClient(cookies);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect(303, '/workout/login');

    const form = await request.formData();
    const notes = String(form.get('notes') ?? '');
    await finishSession(supabase, params.id, notes);
    throw redirect(303, '/workout');
  }
};
```

- [ ] **Step 2: Verifiera type-check**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/routes/workout/session/[id]/+page.server.ts
git commit -m "Add session loader and upsert/finish actions"
```

---

## Task 17: SetRow-komponent

**Files:**
- Create: `src/routes/workout/session/[id]/_components/SetRow.svelte`

- [ ] **Step 1: Skapa SetRow**

Create `src/routes/workout/session/[id]/_components/SetRow.svelte`:
```svelte
<script lang="ts">
  import type { PlanExercise } from '$lib/workout/types';

  let {
    exercise,
    setNumber,
    side,
    initialValue,
    initialWeight,
    initialRir,
    isCompleted,
    onChange
  }: {
    exercise: PlanExercise;
    setNumber: number;
    side: 'left' | 'right' | null;
    initialValue: number | null;
    initialWeight: number | null;
    initialRir: number | null;
    isCompleted: boolean;
    onChange: (data: {
      value: number | null;
      weight: number | null;
      rir: number | null;
    }) => void;
  } = $props();

  let valueInput = $state<string>(initialValue?.toString() ?? '');
  let weightInput = $state<string>(initialWeight?.toString() ?? '');
  let rirInput = $state<string>(initialRir?.toString() ?? '');

  let valueLabel = $derived(exercise.unit === 'seconds' ? 'sek' : 'reps');
  let isBodyweight = $derived(exercise.targetWeightKg === null);

  function emit() {
    const v = valueInput.trim() === '' ? null : Number(valueInput);
    const w = weightInput.trim() === '' ? null : Number(weightInput);
    const r = rirInput.trim() === '' ? null : Number(rirInput);
    onChange({
      value: Number.isFinite(v as number) ? (v as number) : null,
      weight: Number.isFinite(w as number) ? (w as number) : null,
      rir: Number.isFinite(r as number) ? (r as number) : null
    });
  }
</script>

<div
  class="grid grid-cols-[3rem_1fr_1fr_3.5rem] gap-2 items-center px-2 py-2 rounded-md border"
  class:border-sage={isCompleted}
  class:bg-sand={isCompleted}
  class:border-line={!isCompleted}
>
  <span class="text-sm text-stone">
    {setNumber}{#if side}{side === 'left' ? ' V' : ' H'}{/if}
  </span>

  <label class="block">
    <input
      type="number"
      inputmode="numeric"
      placeholder={`${exercise.targetMin}${exercise.targetMin !== exercise.targetMax ? `-${exercise.targetMax}` : ''}`}
      bind:value={valueInput}
      onchange={emit}
      onblur={emit}
      class="w-full bg-paper border border-line rounded px-2 py-1.5 text-center"
    />
    <span class="block text-xs text-stone text-center mt-0.5">{valueLabel}</span>
  </label>

  <label class="block">
    {#if isBodyweight}
      <span class="block text-center text-stone text-sm py-1.5">—</span>
      <span class="block text-xs text-stone text-center mt-0.5">bodyweight</span>
    {:else}
      <input
        type="number"
        step="0.5"
        inputmode="decimal"
        placeholder={exercise.targetWeightKg?.toString() ?? ''}
        bind:value={weightInput}
        onchange={emit}
        onblur={emit}
        class="w-full bg-paper border border-line rounded px-2 py-1.5 text-center"
      />
      <span class="block text-xs text-stone text-center mt-0.5">kg</span>
    {/if}
  </label>

  <label class="block">
    <input
      type="number"
      min="0"
      max="5"
      inputmode="numeric"
      placeholder="RIR"
      bind:value={rirInput}
      onchange={emit}
      onblur={emit}
      class="w-full bg-paper border border-line rounded px-2 py-1.5 text-center"
    />
    <span class="block text-xs text-stone text-center mt-0.5">RIR</span>
  </label>
</div>
```

- [ ] **Step 2: Verifiera type-check**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/routes/workout/session/[id]/_components/SetRow.svelte
git commit -m "Add SetRow component with auto-completion visual"
```

---

## Task 18: ExerciseCard-komponent

**Files:**
- Create: `src/routes/workout/session/[id]/_components/ExerciseCard.svelte`

- [ ] **Step 1: Skapa ExerciseCard**

Create `src/routes/workout/session/[id]/_components/ExerciseCard.svelte`:
```svelte
<script lang="ts">
  import type { PlanExercise } from '$lib/workout/types';
  import type { SessionSetRow } from '$lib/workout/sessions';
  import SetRow from './SetRow.svelte';

  let {
    exercise,
    sets,
    onSetChange
  }: {
    exercise: PlanExercise;
    sets: SessionSetRow[];
    onSetChange: (input: {
      exerciseKey: string;
      setNumber: number;
      side: 'left' | 'right' | null;
      value: number | null;
      weight: number | null;
      rir: number | null;
    }) => void;
  } = $props();

  let sides = $derived(exercise.perSide ? (['left', 'right'] as const) : ([null] as const));

  function existingSet(setNumber: number, side: 'left' | 'right' | null): SessionSetRow | undefined {
    return sets.find(
      s => s.exercise_key === exercise.key &&
           s.set_number === setNumber &&
           s.side === side
    );
  }

  function isCompleted(setNumber: number, side: 'left' | 'right' | null): boolean {
    const s = existingSet(setNumber, side);
    if (!s) return false;
    if (exercise.targetWeightKg === null) return s.value > 0;
    return s.value > 0 && s.weight_kg !== null;
  }
</script>

<section class="bg-paper border border-line rounded-2xl p-4 space-y-3">
  <header>
    <h3 class="font-display text-lg font-medium">{exercise.name}</h3>
    <p class="text-sm text-stone">
      {exercise.targetSets} ×
      {#if exercise.targetMin === exercise.targetMax}{exercise.targetMin}{:else}{exercise.targetMin}–{exercise.targetMax}{/if}
      {exercise.unit === 'seconds' ? ' sek' : ''}
      @ {exercise.loadDescription}
      {#if exercise.amrap}<span class="text-stone italic"> · AMRAP</span>{/if}
    </p>
    <p class="text-sm text-stone italic mt-1">{exercise.cue}</p>
  </header>

  <div class="space-y-2">
    {#each Array(exercise.targetSets) as _, i}
      {#each sides as side}
        <SetRow
          {exercise}
          setNumber={i + 1}
          {side}
          initialValue={existingSet(i + 1, side)?.value ?? null}
          initialWeight={existingSet(i + 1, side)?.weight_kg ?? null}
          initialRir={existingSet(i + 1, side)?.rir ?? null}
          isCompleted={isCompleted(i + 1, side)}
          onChange={(data) =>
            onSetChange({
              exerciseKey: exercise.key,
              setNumber: i + 1,
              side,
              ...data
            })
          }
        />
      {/each}
    {/each}
  </div>
</section>
```

- [ ] **Step 2: Verifiera type-check**

Run: `npm run check`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/routes/workout/session/[id]/_components/ExerciseCard.svelte
git commit -m "Add ExerciseCard component with set grid and side support"
```

---

## Task 19: Loggnings-vy + auto-spara

**Files:**
- Create: `src/routes/workout/session/[id]/+page.svelte`

- [ ] **Step 1: Skapa loggnings-vyn**

Create `src/routes/workout/session/[id]/+page.svelte`:
```svelte
<script lang="ts">
  import type { PageData } from './$types';
  import ExerciseCard from './_components/ExerciseCard.svelte';
  import type { SessionSetRow } from '$lib/workout/sessions';

  let { data }: { data: PageData } = $props();

  // Lokal kopia av sets så vi kan uppdatera utan reload
  let sets = $state<SessionSetRow[]>(data.sets);
  let notes = $state<string>(data.session.notes ?? '');
  let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Räkna ut completion-progress
  let totalSetsPlanned = $derived(
    data.workout.exercises.reduce(
      (acc, ex) => acc + ex.targetSets * (ex.perSide ? 2 : 1),
      0
    )
  );
  let totalSetsDone = $derived(
    sets.filter(s => {
      const ex = data.workout.exercises.find(e => e.key === s.exercise_key);
      if (!ex) return false;
      if (ex.targetWeightKg === null) return s.value > 0;
      return s.value > 0 && s.weight_kg !== null;
    }).length
  );

  // Debounced upsert per (exercise_key, set_number, side)
  const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

  function debouncedUpsert(input: {
    exerciseKey: string;
    setNumber: number;
    side: 'left' | 'right' | null;
    value: number | null;
    weight: number | null;
    rir: number | null;
  }) {
    if (input.value === null) return;   // skippa tomma rader

    const dedupeKey = `${input.exerciseKey}:${input.setNumber}:${input.side ?? ''}`;
    const existing = debounceTimers.get(dedupeKey);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(() => {
      void doUpsert(input);
      debounceTimers.delete(dedupeKey);
    }, 500);

    debounceTimers.set(dedupeKey, timer);
  }

  async function doUpsert(input: {
    exerciseKey: string;
    setNumber: number;
    side: 'left' | 'right' | null;
    value: number | null;
    weight: number | null;
    rir: number | null;
  }) {
    saveStatus = 'saving';
    try {
      const formData = new FormData();
      formData.set('exercise_key', input.exerciseKey);
      formData.set('set_number', String(input.setNumber));
      if (input.side) formData.set('side', input.side);
      formData.set('value', String(input.value));
      formData.set('weight_kg', input.weight === null ? '' : String(input.weight));
      formData.set('rir', input.rir === null ? '' : String(input.rir));

      const res = await fetch('?/upsertSet', { method: 'POST', body: formData });
      const result = await res.json();
      if (result.type !== 'success') throw new Error('Save failed');

      const parsed = JSON.parse(result.data);
      const updated = parsed[0]?.set as SessionSetRow | undefined;
      if (updated) {
        const idx = sets.findIndex(s => s.id === updated.id);
        if (idx >= 0) sets[idx] = updated;
        else sets = [...sets, updated];
      }
      saveStatus = 'saved';
      setTimeout(() => { if (saveStatus === 'saved') saveStatus = 'idle'; }, 1500);
    } catch (e) {
      console.error(e);
      saveStatus = 'error';
    }
  }

  // Spara notes på blur
  let notesTimer: ReturnType<typeof setTimeout> | null = null;
  function notesChanged() {
    if (notesTimer) clearTimeout(notesTimer);
    notesTimer = setTimeout(() => {
      const formData = new FormData();
      formData.set('notes', notes);
      void fetch('?/saveNotes', { method: 'POST', body: formData });
    }, 800);
  }
</script>

<svelte:head>
  <title>{data.workout.name} — Workout</title>
</svelte:head>

<main class="mx-auto max-w-md px-4 py-5 space-y-4 pb-32">
  <header class="space-y-1">
    <p class="text-xs uppercase tracking-mono text-stone">{data.workout.subtitle}</p>
    <h1 class="font-display text-2xl font-medium tracking-tight">{data.workout.name}</h1>
    <p class="text-sm text-stone">
      {totalSetsDone}/{totalSetsPlanned} set
      {#if saveStatus === 'saving'}<span class="ml-2 italic">sparar…</span>{/if}
      {#if saveStatus === 'saved'}<span class="ml-2 text-sage italic">sparat</span>{/if}
      {#if saveStatus === 'error'}<span class="ml-2 text-wine italic">kunde inte spara</span>{/if}
    </p>
  </header>

  {#each data.workout.exercises as exercise (exercise.key)}
    <ExerciseCard
      {exercise}
      {sets}
      onSetChange={debouncedUpsert}
    />
  {/each}

  <section class="bg-paper border border-line rounded-2xl p-4">
    <label class="block">
      <span class="block text-sm text-stone mb-2">Anteckning (frivillig)</span>
      <textarea
        bind:value={notes}
        oninput={notesChanged}
        rows="3"
        placeholder="Hur kändes det idag?"
        class="w-full bg-sand border border-line rounded-lg px-3 py-2 text-ink"
      ></textarea>
    </label>
  </section>

  <form method="POST" action="?/finish" class="sticky bottom-4">
    <input type="hidden" name="notes" value={notes} />
    <button
      type="submit"
      class="w-full bg-ink text-paper rounded-lg py-3.5 font-medium text-lg hover:opacity-90 transition shadow-lg"
    >
      Avsluta passet
    </button>
  </form>
</main>
```

- [ ] **Step 2: Manuell test — full happy path**

Run: `npm run dev` (om inte igång)
1. Logga in på `/workout/login`
2. På startskärmen, klick "Starta passet"
3. Du landar på loggnings-vyn med dagens pass
4. Fyll i value + vikt på första set:en av första övningen → vänta 1 sek → "sparat" visas
5. För perSide-övning (t.ex. KB press), bekräfta att V/H rader syns separat
6. Skriv något i anteckningsfältet → vänta → ingenting visas men data sparas
7. Klick "Avsluta passet" → redirect till /workout
8. Verifiera i Supabase Table Editor att `sessions` har en rad med `completed_at != null` och `session_sets` har dina rader

Expected: alla steg fungerar.

- [ ] **Step 3: Commit**

```bash
git add src/routes/workout/session/[id]/+page.svelte
git commit -m "Add session logging view with auto-save and progress"
```

---

## Task 20: Slutverifiering och deploy-prep

**Files:**
- ingen kod

- [ ] **Step 1: Kör alla tester**

Run: `npm test`
Expected: alla tester PASS.

- [ ] **Step 2: Type-check + svelte-check**

Run: `npm run check`
Expected: PASS — inga fel eller varningar i workout-koden.

- [ ] **Step 3: Lokal end-to-end-rökt**

Run: `npm run dev`
Gå igenom flödet: utloggad → login → startskärm → starta pass → logga ett set per övning → avsluta → tillbaka till start. Stäng tabben mitt i ett pass och öppna `/workout` igen — verifiera att "Fortsätt passet" visas.

- [ ] **Step 4: Lägg till Vercel env-vars**

Manuellt i Vercel dashboard för nicoleboman.se-projektet:
- `PUBLIC_SUPABASE_URL` = (samma som lokal `.env`)
- `PUBLIC_SUPABASE_ANON_KEY` = (samma som lokal `.env`)

- [ ] **Step 5: Push branch och öppna PR (eller merge till main)**

```bash
git push -u origin workout-tracker
```

Antingen öppna PR mot main för review, eller merga direkt om du jobbar solo.

- [ ] **Step 6: Verifiera deploy**

Vänta tills Vercel-deploy är grön. Gå till `https://nicoleboman.se/workout/login` på telefonen, logga in och kör ett riktigt pass.

Expected: allt fungerar i produktion.

---

## Future Phases (out of scope för denna plan)

Dessa skrivs som separata planer när Foundation + Core Logging är deployad och testad i några pass:

- **Fas 3 — Live-features:** vilo-timer (nedräkning, ljud, vibration), Wake Lock API, "Som planerat"-snabbknapp per övning, "Lägg till extra set"
- **Fas 4 — Andra pass-typer:** cardio_z2 (duration + activity_type), active_recovery (TGU practice), emom (interval-blocks)
- **Fas 5 — Historik + analys:** /workout/history, /workout/exercise/[slug], progressionsgraf (egen SVG), PR-detektion + toast, "Senaste PR" på startskärmen
- **Fas 6 — Plan-referens + PWA:** /workout/plan (statisk referensvy), manifest.webmanifest, service worker, installerbar PWA

---

## Self-review-noteringar

Genomgång efter att hela planen skrevs. Saker jag verifierat:

- **Spec-täckning för fas 1+2:** alla beskrivna komponenter har en task — auth (T11–13), startskärm (T14–15), session-loader (T16), set/exercise-komponenter (T17–18), loggnings-vy (T19). Plan-data (T5–7), schedule (T9), Supabase-helpers (T10).
- **Type-konsistens:** `WorkoutKey`, `ExerciseKey`, `PlanExercise.unit`, `SessionSetRow.value`/`side` används konsekvent över tasks.
- **Ingen uppfunnen funktion:** alla helpers definieras innan de används (`createSession`, `getActiveSession`, `getSession`, `getSessionSets`, `upsertSet`, `finishSession`, `updateSessionNotes` definieras i T10, används från T14 och framåt).
- **Risk: `enhance` + `?/start` action returns redirect.** SvelteKit `enhance` följer redirects automatiskt (303). Testas i T15 manuella verifiering.
- **WORKOUTS-typ:** `Partial<Record<WorkoutKey, Workout>>` (rättat efter T6 code-review). `Object.values()` returnerar `Workout[]` rent. Indexering `WORKOUTS[key]` returnerar `Workout | undefined` — konsumer i T14 använder `?? null`, T16 har explicit `if (!workout)` guard. Cardio/recovery/EMOM-pass kommer i fas 4-plan.
- **Risk: actions saknar parent-data.** Fixat i T14 step 2 — använd `supabase.auth.getUser()` direkt i actions.
