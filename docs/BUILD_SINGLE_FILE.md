# Build Single Userscript

This project keeps modular i18n files under `src/i18n/` and writes them back into the single userscript file used by Tampermonkey.

## Command

```bash
node scripts/build-userscript.js
```

## Output

- `claude-translator.js` (in-place update)

## Current Behavior

- Runtime and deployment file: `claude-translator.js`
- Build script injects `src/i18n/index.js` data into the I18N block and updates `claude-translator.js` directly.
- This keeps deployment as one userscript file while allowing i18n modularization.
