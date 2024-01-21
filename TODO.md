# 🎯 TODO

## v2

- [x] Add e2e tests with github actions (for all operating systems)
- [x] Upgrade to unbuild `3.0.0` (currently errors), fix `masquerading as CJS` error [(see here)](https://arethetypeswrong.github.io/?p=eemoji)
- [x] Upgrade antfu/eslint-config to `2.0.0` and make it work
- [ ] 2 more options: (any combination of these should work)
  - [ ] `strict (boolean) [false]` - do not allow any commits without emojis
  - [ ] `conventional (boolean) [true]` - only allow conventional commits, this package should work without conventional commits as well
- [ ] new option: `mode (overwrite|append) [append]` - overwrite or append the config (for both json and ts) (idea: if emoji prop is specified, overwrite, else use default + you can import the default emojis to append them)
- [ ] add `-v` alias for `--version`
- [ ] make the consola start and success logs sane in the cleanup command
- [ ] rewrite the bin files in typescript and also build them
- [ ] refactor a lot!
- [ ] Generate the readme emoji table from `emojis.json` (jsonc for description? how to bundle jsonc?)
- [ ] try astro and create a small website explaining which emoji to use and when, + stuff
