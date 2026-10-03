# Vendored: pi-context-view

Source: https://github.com/dimk90/pi-context-view
Upstream version: 0.6.0 (commit `0eb5f97`)
License: MIT, Copyright (c) 2026 Dmitry Makarov — see `LICENSE` in this directory.

`src/context-view/` and `tests/context-view/` are copied from upstream `src/` and
`test/` with the smallest possible diff so updates can be re-synced.

## Local modifications

- `index.ts`: the default-export extension registration became
  `installContextView(pi): ContextViewController`. Atelier owns the command
  surface (`/atelier context [usage|injections|config]`), and the controller also
  exposes `summarize()` for the sidebar's CONTEXT DETAIL panel. `summarize()`
  never probes.
- `settings.ts`: `readAutoCompactReserveTokens` takes a structural subset of
  `ExtensionCommandContext` so the sidebar's `ExtensionContext` also fits.
- Optional properties are declared `?: T | undefined` and a handful of index
  accesses are guarded, to satisfy Atelier's `exactOptionalPropertyTypes` and
  `noUncheckedIndexedAccess`.
- Test fixtures add `ToolInfo.exposure`, required since Pi 1.0.
- Tests keep upstream's `node:test` form and run with
  `npm run test:context-view`; vitest and Biome skip both vendored directories.

## Re-syncing

1. Copy upstream `src/` over `src/context-view/` (keep `LICENSE`, `VENDOR.md`).
2. Re-apply the modifications above (`npm run typecheck` reports what is missing).
3. Copy upstream `test/` over `tests/context-view/` and rewrite `../src/` imports
   to `../../src/context-view/`.
