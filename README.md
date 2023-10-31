# eemoji

This tiny CLI tool automatically adds an emoji to your commit messages based on conventional commit types.

## 😎 Emojis

Hi, read the `README.md` first (starting with [Install](#🚀-install)). This emoji table is for quick reference.

<details open>
<summary><b>Close/open gigantic table</b></summary>

| Type | Subtype | Emoji | Description |
| ---- | ------- | ----- | ----------- |
| `fix` | `.` | 🔧 | general fix |
| `fix` | `typo` | ✏️ | fixed typo in code, docs, ui, etc. |
| `fix` | `bug` | 🐛 | fixed a bug |
| `fix` | `lint` | 🧼 | fixed linting errors |
| `lint` | | 🧼 | |
| `chore` | `.` | 🗑️ | did some chores |
| `chore` | `release` | 🔖 | new release commit (pairs well with [bumpp](https://github.com/antfu/bumpp) and [changelogithub](https://github.com/antfu/changelogithub)) |
| `chore` | `cleanup` | 🧹 | cleaned up code, removed logs and debug stuff, making things ready for production |
| `chore` | `license` | 📜 | changed the license |
| `chore` | `deps` | 📦 | updated dependencies |
| `chore` | `readme` | 📕,📗,📘,📙 | update the README |
| `release` | | 🔖 | |
| `cleanup` | | 🧹 | |
| `deps` | `.` | 📦 | added/removed/changed dependencies |
| `deps` | `up` | ⬆️ | updated dependencies |
| `deps` | `down` | ⬇️ | downgraded dependencies |
| `feat` | | ✨ | introduced a new feature |
| `docs` | | 📝 | documented something |
| `test` | | 🧪 | worked on tests |
| `refactor` | | ♻️ | refactored code, achieved the same with less |
| `init` | | 🎉 | started a new project! |
| `initial` | | 🎉 | this is for the default GitHub commit message (untested) |
| `perf` | | ⚡ | improved performance, achieve the same faster |
| `config` | | ⚙️ | changed configuration files |
| `build` | | 🦺 | work regarding build processes |
| `style` | | 🎨 | design changes, style changes |
| `ui` | | 🪟 | worked on UI, UX or layout |
| `text` | | 💬 | changed string literals, text content |
| `breaking` | | 💥 | *special type:* will be used if the commit contains an exclamation mark (`!`), indicates breaking changes |
| `revert` | | ⏪ | revert a commit |
| `ci` | | 🦾 | changed workflow files, CI stuff |
| `i18n` | | 🌐 | translated something |
| `wip` | | 🚧 | wildcard type, works for anything |
| `add` | | ➕ | |
| `remove` | | ➖ | |

</details>

## 🚀 Install

The package ensures that the JSON schema is added to `settings.json`, and creates a `prepare-commit-msg` git hook.

> Recommended: local install as a dev dependency

### Locally

This way you can add `eemoji` to your `package.json` dependencies, and share it with other contributors (they will need to run `eemoji` once as well).

```bash
npm i -D eemoji
```

### Globally

Installing globally allows you to use `eemoji` everywhere, not just in node projects.

> **Note**
> For `eemoji` to work in a repository you still need to run it once, so that it can install the git hook.

```bash
npm i -g eemoji
```

## 📖 Usage

Just run it once in your project to initialize it:

```bash
npx eemoji
```

**Commands:**

- `--version`: Show version number
- `-h, --help`: Show help (useless)

## 🦾 Config

The default configuration is here: [emojis.json](./src/emojis.json), or scrutinize the [Emojis](#😎-emojis) section for details.

This is used if no config file is found in the project.

Apart from the emojis the config also specifies the format of the commit message, see [Format](#format).

`eemoji` can be configured two different ways: [json](#json-config) and [typescript](#ts-config) config files.

> Recommended: use `eemoji.config.ts` in project root

### TS Config

This way your emojis will be merged with the default ones.

`eemoji` will look for these config files:

- `eemoji.config.ts`

<details>
<summary><b>See all ...</b></summary>

- `.eemojirc.{js,ts,cjs,mjs}`
- `eemoji.config.{js,ts,cjs,mjs}`
- `.config/eemoji.config.{js,ts,cjs}`

</details>

#### Simple demonstration

```ts
import { defineConfig } from 'eemoji'

export default defineConfig({
  format: '{emoji} {type}: {subject}',
  emojis: {
    fix: '🔧',
    chore: '🗑️',
    feat: '✨',
    docs: '📝',
    test: '🧪'
  }
})
```

**Example:**

Commit message:

- before: `fix: navbar issue`
- after: `🔧 fix: navbar issue`

#### Format

The format specifies how the commit message will be formatted (`{emoji} {type}: {subject}` is the default format btw, this property is optional).

- `{type}`: this determines the emoji
- `{subject}`: rest of the commit message
- `{emoji}`: the place of the emoji to be inserted

Some other formats I could think of:

- `{emoji} {type} - {subject}`
- `{emoji} {type} {subject}`
- `{type}: {emoji} {subject}`

#### Nested emojis

You can also nest emojis to create subtypes. After finding the type, `eemoji` will look for subtypes in the commit message.

```ts
import { defineConfig } from 'eemoji'

export default defineConfig({
  emojis: {
    fix: {
      '.': '🔧',
      'typo': '✏️',
      'bug': '🐛'
    },
    chore: {
      '.': '🗑️',
      'release': '🔖',
      'cleanup': '🧹',
      'license': '📜',
      'deps': '📦'
    },
    feat: '✨',
    bounty: '💎,💲,💸,💰'
  }
})
```

You can specify multiple emojis by separating them with commas and a **random** one will be chosen.

Either using conventional commit scopes or just including the subtype in the commit message will work.

**Examples:**

Commit message:

- before: `fix: navbar issue`
- after: `🔧 fix: navbar issue`

<hr>

- before: `fix: typo in README`
- after: `✏️ fix: typo in README`

<hr>

- before: `chore: release v1.0.0`
- after: `🔖 chore: release v1.0.0`

<hr>

- before: `chore(deps): update eslint`
- after: `📦 chore(deps): update eslint`

### JSON Config

Same deal, but you overwrite the whole config.

> **Warning**
> You must specify the `format` property

You also get types thanks to the JSON schema.

`eemoji` will look for these config files:

- `.eemojirc.json`

<details>
<summary><i><b>See all ...</b></i></summary>

- `.eemojirc`
- `.eemojirc.{json,yaml,yml}`
- `.config/eemojirc`
- `.config/eemojirc.{json,yaml,yml}`

</details>

## 📜 License

[MIT](./LICENSE)
