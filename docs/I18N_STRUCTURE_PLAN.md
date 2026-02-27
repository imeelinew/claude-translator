# I18N Structure Plan (Phase B)

This file defines the target data layout before moving dictionary content.

## Current State
- All dictionaries are in `claude-translator.js` under one `I18N` object.
- Public static dictionary is large and mixed by feature area.
- Selector rules are currently in `public.selector`.

## Target Layout
Planned file structure:

```
src/
  i18n/
    public-static.js
    public-regexp.js
    public-selector.js
    chat-static.js
    chat-regexp.js
    chat-selector.js
    settings-static.js
    settings-regexp.js
    settings-selector.js
    login-static.js
    login-regexp.js
    login-selector.js
    index.js
```

## Migration Rules
1. Do not change key text or translated values during migration.
2. Preserve matching priority:
   - static exact match
   - regexp (feature gated)
   - selector replacement
3. Keep `public` + page-specific merge behavior unchanged.
4. Keep all currently commented duplicate lines commented until final cleanup phase.

## Validation Rules
After each migration chunk:
- Run duplicate key checker script.
- Run `docs/REGRESSION_CHECKLIST.md` manually.
- If any mismatch appears, rollback only the chunk that introduced it.
