# Build Single Userscript

This project keeps modular i18n files under `src/i18n/` and can emit a single userscript file for Tampermonkey.

## Command

```bash
node scripts/build-userscript.js
```

## Output

- `dist/claude-translator.user.js`

## Current Behavior

- Runtime development file: `claude-translator.js`
- Build script injects `src/i18n/index.js` data into the I18N block and writes single-file output.
- This keeps deployment format unchanged (one userscript file) while allowing i18n modularization.
