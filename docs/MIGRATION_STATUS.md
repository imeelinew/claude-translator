# Migration Status

## Phase A
- [x] Backup created: `claude-translator.backup.phaseAB.js`
- [x] Regression checklist added

## Phase B
- [x] Folder skeleton created under `src/i18n/`
- [x] Index aggregator added: `src/i18n/index.js`
- [x] `public.selector` mirrored to `src/i18n/public-selector.js`
- [x] `public.regexp` mirrored to `src/i18n/public-regexp.js`
- [x] `public.static` mirrored to `src/i18n/public-static.js`
- [x] `chat/settings/login` data migration
- [x] Single-file build script added: `scripts/build-userscript.js`
- [x] Single-file in-place build supported: `claude-translator.js`

## Phase C
- [x] Runtime constants centralized (`OBSERVED_ATTRIBUTES`, dynamic rule constants)
- [x] Shared ignore-area helper added (`isInIgnoredArea`)
- [x] Dynamic text translator optimized to reuse predeclared rules
- [x] Inline mixed-sentence translator normalized with predeclared regex constants
- [x] Observer config deduplicated to use shared observed-attributes constant
- [x] Optional debug logger hook added (`DEBUG` + `debugLog`)

## Phase D/E (partial)
- [x] Ignore selector list normalized as array + joined selector string
- [x] Dynamic text translation gated by quick precheck to reduce unnecessary regex work

## Notes
- Runtime still uses `claude-translator.js` only.
- Runtime source of truth remains `claude-translator.js` until final cutover.
- `claude-translator.js` can be regenerated from modular i18n via build script.
