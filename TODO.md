# 🎯 TODO

## Backlog

- [ ] 1 more options (any combination of options should work)
  - [ ] `conventional (boolean) [true]` - only allow conventional commits, this package should work without conventional commits as well

## v2

- [x] Add e2e tests with github actions (for all operating systems)
- [x] Upgrade to unbuild `2.0.0` (currently errors), fix `masquerading as CJS` error [(see here)](https://arethetypeswrong.github.io/?p=eemoji) (fixed it but we ESM only now because i dont know what to do with the bin/eemoji.mjs entry file)
- [x] Upgrade antfu/eslint-config to `2.0.0` and make it work
- [x] `strict (boolean) [false]` - do not allow any commits without emojis
- [x] add `-v` alias for `--version`
- [x] make the consola start and success logs sane in the cleanup command
- [x] investigate speed, prepare script for init
- [x] move bin scripts to `scripts` folder and also build them from typescript
- [x] Generate the readme emoji table from `emojis.jsonc` (jsonc for description)
- [ ] overwrite the default emojis in ts config too (import the default emojis, import other presets)
- [ ] try astro and create a small website explaining which emoji to use and when, + stuff
