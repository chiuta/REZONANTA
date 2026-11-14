# Changelog

## 1.1.0 — 2026-11-14

- Interface in 8 languages (ro, en, fr, de, es, it, hu, pt): selector in the page footer, language remembered, falls back to the browser language.
- Generated texts (message house, press release, interview sheet, crisis statement), channel advice, plan templates and examples follow the chosen language; dates use the language's format.
- The clarity analyser has its own rules per language (jargon, passive voice, “we” vs “you” pronouns, abbreviations).
- The tone list keeps stable Romanian keys in the saved state, so saved data stays valid across languages.
- New test `tests/i18n.test.mjs` (no Romanian text left in the 7 translated languages, runtime language switch, analyser per language); `tests/app.test.mjs` now expects 8 languages. The footer language selector keeps axe at 0 violations.

## 1.0 — 2026-11-06

- Adopt the fff-kit, `#app-version`, metas, `app.json`; MIT licence file added.
- Replace `unsafe-inline` in `script-src` with SHA-256 hashes; navigation exposed as a landmark (axe 0 violations).
- Add own test suite. Interface remains Romanian only.
