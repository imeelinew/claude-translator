# Claude Translator Regression Checklist

Use this checklist after each refactor phase. Any failed item blocks the next phase.

## 1) Core Sidebar Navigation
- [ ] `New chat` is translated.
- [ ] `Search` is translated.
- [ ] `Customize` is translated.
- [ ] `Chats` is translated.
- [ ] `Projects` is translated.
- [ ] `Code` is translated.
- [ ] `Starred` is translated.
- [ ] `Recents` is translated.
- [ ] `Hide` is translated when the button appears.

## 2) Chat List Dynamic Text
- [ ] `N chats with Claude` is translated.
- [ ] `Last message N minutes/hours/days ago` is translated.
- [ ] `about N minutes/hours/days ago` in chat list is translated.

## 3) Input/Output Safety (Must Not Translate)
- [ ] User input box content is never translated while typing.
- [ ] Model output body content is never translated.
- [ ] Example like `about 500 years ago` in model output stays unchanged.

## 4) Account Menu / Floating Menus
- [ ] Account menu items (Language/Get help/Upgrade plan/etc.) are translated.
- [ ] Chat item context menu items (Star/Rename/Add to project/Delete) are translated.

## 5) Settings Area
- [ ] Existing settings translations remain functional.
- [ ] Mixed sentence with inline link is translated naturally and has no page error.

## 6) Stability / Runtime
- [ ] No obvious UI flicker loop caused by repeated replacement.
- [ ] No console errors caused by translator logic during normal interaction.
- [ ] Route change (`/new` <-> `/chat/*` <-> `/settings`) keeps translation active.

## 7) Toggle Behavior
- [ ] Tampermonkey menu toggle for regexp works.
- [ ] Toggle change does not break existing static/selector translation.
