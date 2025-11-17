# Contributing to Radar Chart Builder

A huge thanks for helping improve this customizable radar chart builder! These
guidelines keep contributions consistent and easy to review.

## Getting Started

1. Fork the repo and clone your fork.
2. Install dependencies with `npm install`.
3. Run `npm run dev` to start the Next.js development server at
   http://localhost:3000 (landing) and `/chart` for the builder.
4. Use `npm run build` to verify the production bundle and type checks before
   opening a pull request.
5. Run `npm run lint` and address all warnings; lint must pass prior to review.

## Coding Standards

- TypeScript is strict and uses the `@/*` alias for `src/*`; prefer `@` imports
  over long relative paths.
- Author React Server Components by default and add `"use client"` only when
  hooks or browser APIs are required.
- Component filenames use kebab-case (e.g., `radar-chart-preview.tsx`), while
  component exports remain PascalCase.
- Stick to two-space indentation and avoid auto-formatters unless the project
  adds one.
- Reuse Tailwind utilities and helpers in `src/components` and
  `src/components/ui`; place shared helpers in `src/lib/utils.ts`.
- Keep new static assets under `public/` and update `src/styles/globals.css` for
  any new Tailwind layer definitions.

## Branches, Commits, and PRs

- Branch naming is flexible; pick something descriptive such as
  `feature/chart-presets` or `fix/tooltip-alignment`.
- Commit messages should be short, imperative, under 72 characters (e.g.,
  `Add dark theme palette swap`).
- Each PR should include:
  - A concise summary of the change plus any linked issue IDs.
  - Screenshots or GIFs for UI changes, especially anything affecting the
    `/chart` builder.
  - A test plan describing commands run (`npm run build`, `npm run lint`, manual
    routes exercised).
  - Callouts for follow-up work or known gaps.
- Resolve merge conflicts and ensure CI lint/build steps pass before requesting
  review.

## Reporting Issues

If you encounter bugs or have feature ideas:

1. Search existing issues to avoid duplicates.
2. Include clear reproduction steps, screenshots, and environment details (OS,
   browser, Node version).
3. Label requests as `bug`, `enhancement`, or `docs` if you have label access.
