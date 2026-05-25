# AGENTS.md — מִרְדָּף הַמִּלִּים (Word Chase)

A Hebrew typing game built with React + Vite in a Figma Make environment.
Players type falling Hebrew word bubbles before they reach the character. Three difficulty levels control bubble size and keyboard hint visibility.

---

## Tech Stack

| Tool | Version | Notes |
|---|---|---|
| React | 18.3.1 | Do NOT upgrade — version is locked by Figma Make runtime |
| react-dom | 18.3.1 | Same constraint |
| React Router | 7.x | Uses `createBrowserRouter` + `Component` key (not `element`) |
| motion | 12.x | Import from `motion/react`, never from `framer-motion` |
| Tailwind CSS | 4.x | Via `@tailwindcss/vite` plugin |
| TypeScript | strict via Vite | No `tsconfig.json` overrides yet |
| pnpm | required | Do not use `npm` or `yarn` |
| Vite | 6.x | |

---

## File Map

```
src/
  app/
    App.tsx               — RouterProvider only; do not add logic here
    Root.tsx              — Outlet wrapper; do not add logic here
    routes.ts             — Route config; use .tsx extensions on all imports
    pages/
      Landing.tsx         — ⚠️ Make-owned (see below)
      Game.tsx            — ⚠️ Make-owned (see below)
    components/
      RunningCharacter.tsx — Shared animated character; accepts `scale` prop
      MiniKeyboard.tsx    — Hebrew keyboard hint; hidden on hard difficulty
      ui/                 — Shadcn/Radix primitives; do not modify
  styles/
    index.css             — Tailwind entry + theme mapping; preserve token contract
    theme.css             — Design tokens; preserve all existing token names
    fonts.css             — Google Fonts imports (Rubik + Assistant)
```

---

## ⚠️ Figma Make Layer — Read Before Touching Pages

This project runs inside **Figma Make**, which co-owns certain files via its generative layer.

**Make-owned files** (generated/updated by Figma Make):
- `src/app/pages/Landing.tsx`
- `src/app/pages/Game.tsx`

**Developer-owned files** (safe to refactor, add, or test freely):
- `src/app/components/RunningCharacter.tsx`
- `src/app/components/MiniKeyboard.tsx`
- `src/app/routes.ts`
- `src/app/Root.tsx`
- `src/app/App.tsx`
- Anything under `src/lib/` (future hooks, utils, types)

**Rules:**
- Do not wholesale rewrite Make-owned pages. Extract logic out of them into `src/lib/` instead.
- Make will re-generate page files; hooks and utilities it imports from `src/lib/` will survive re-generation.
- Review `git diff` after any Make session before committing — Make changes go directly to disk.

---

## Hard Constraints

**RTL / Hebrew**
- Every page root must have `dir="rtl"`.
- All copy is Hebrew-first. Do not add English placeholder text.

**Tailwind token contract**
- `src/styles/index.css` maps CSS variables to Tailwind utility classes (`bg-background`, `text-foreground`, `border-border`, etc.).
- Never remove or rename `--background`, `--foreground`, `--border`, `--primary`, `--radius`, or their `@theme inline` mappings. Adding new tokens is fine.

**Motion imports**
- Always: `import { motion, AnimatePresence } from "motion/react"`
- Never: `import { ... } from "framer-motion"`

**Vite import resolution**
- All local imports must include the `.tsx` or `.ts` extension (e.g. `"./pages/Game.tsx"` not `"./pages/Game"`). Vite's module graph requires this in this project.

**React version**
- Stay on React 18.3.1. The version is provided by the Figma Make runtime. Do not install `react` or `react-dom` as direct dependencies.

---

## Code Style

- **No comments** unless the WHY is non-obvious (a hidden constraint, a workaround, a subtle invariant). Never describe what the code does — names do that.
- **No premature abstraction.** Three similar lines is better than a helper that exists for one caller.
- **No error handling for impossible cases.** Trust React, Router, and TypeScript; only validate at system boundaries.
- **No unused backwards-compat shims.** Delete dead code; don't rename it to `_unused`.
- **No half-finished implementations.** A stub is worse than nothing — either build it or leave it out.
- Prefer editing existing files over creating new ones.

---

## Dev Commands

```bash
pnpm dev          # start Vite dev server (http://localhost:5173)
pnpm build        # production build
pnpm test         # Vitest unit tests (runs in Node, no browser needed)
pnpm test:watch   # Vitest in watch mode
pnpm e2e          # Playwright E2E tests (requires system browser deps — see note)
pnpm e2e:ui       # Playwright with interactive UI
```

> **E2E note:** Playwright requires system libraries (`libglib-2.0`, etc.) that are not available in the Figma Make sandbox. Run `pnpm e2e` locally or in GitHub Actions where `playwright install-deps` can run as root.

---

## Roadmap (pending PRs)

These are intentionally missing — not oversights:

1. `AGENTS.md` — ✅ this file
2. Extract `useGameState` hook — ✅ `src/lib/useGameState.ts`
3. Move word lists, types, constants into `src/lib/` — ✅ `words.ts`, `types.ts`, `constants.ts`
4. Vitest unit tests — ✅ `src/lib/*.test.ts` (11 tests, all passing)
5. Playwright E2E — ✅ `e2e/*.spec.ts` (runs locally/CI; blocked by sandbox in Figma Make)
6. ESLint + Prettier — ✅ `eslint.config.ts`, `.prettierrc`, `.prettierignore`
7. TypeScript strict mode — ✅ `tsconfig.json`, `src/vite-env.d.ts`
8. GitHub Actions CI — ✅ `.github/workflows/ci.yml`
