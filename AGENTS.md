# Repository Guidelines

## Project Structure & Module Organization

The Next.js App Router lives under `src/app`, with `page.tsx` delivering the
landing experience and `app/chart` hosting the interactive builder. Reusable UI
(chart widgets, preview panes, theming) sits in `src/components`, while
shadcn-inspired primitives stay in `src/components/ui` to keep third-party
updates isolated. Shared helpers such as color scaling and schema transforms
belong in `src/lib/utils.ts`. Global Tailwind layers load from
`src/styles/globals.css`, and static assets or downloadable presets reside in
`public/`. Keep configuration files (e.g., `next.config.ts`,
`postcss.config.mjs`, `tsconfig.json`) at the repo root so CI can pick them up
without extra paths.

## Build, Test, and Development Commands

- `npm run dev` (or `pnpm dev`) — launches the Next 16 dev server on
  http://localhost:3000 for live editing.
- `npm run build` — creates a production bundle and type-checks using the strict
  TypeScript config.
- `npm run start` — serves the last build; use this when validating deployment
  artifacts.
- `npm run lint` — runs `eslint-config-next` with the Core Web Vitals ruleset;
  address warnings before pushing.

## Coding Style & Naming Conventions

TypeScript is strict (`tsconfig.json`) and resolves `@/*` aliases into `src/*`;
prefer those imports over long relative chains. Author React Server Components
by default and add `"use client"` only where hooks or browser APIs are required.
Component files follow kebab-case filenames (`radar-chart-preview.tsx`), while
the default export remains PascalCase. Co-locate styles in Tailwind utility
classes, using `clsx`/`tailwind-merge` helpers already installed. Run ESLint
before committing; no auto-formatting tool is shipped, so keep indentation at
two spaces to mirror the existing codebase.

## Testing Guidelines

Automated tests are not yet configured; prioritize adding Vitest + React Testing
Library when touching logic-heavy modules such as `src/lib/utils.ts`. Until
then, document manual QA in pull requests (routes exercised, browsers,
screenshots). When you do add specs, store colocated `.test.tsx` files beside
the component or under `src/__tests__`, and name them after the feature (e.g.,
`radar-chart-widget.test.tsx`). New features should include at least one
interaction test plus coverage for any data-normalization helpers.

## Commit & Pull Request Guidelines

History currently consists of short imperative messages (e.g., “Initial
commit…”); keep that style: start with a verb, stay under 72 characters, and
describe the observable change. Each pull request should include: a
one-paragraph summary, linked issue or task ID, screenshots/GIFs for UI changes
(especially the `/chart` builder), a test plan describing commands run, and
callouts for follow-up work. Request review once lint passes and conflicts are
resolved.

## Environment & Configuration Tips

The project targets React 19 and Next 16; verify dependency changes against
those versions. Tailwind 4 is wired through `@tailwindcss/postcss`, so add new
layers via `globals.css` rather than bespoke PostCSS plugins. Theme toggling
relies on `src/components/theme-provider.tsx`; extend color palettes there to
keep the builder preview and exported charts in sync. Any runtime settings
exposed to the client must be prefixed with `NEXT_PUBLIC_` and documented in
`.env.example` before use.
