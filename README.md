# eemoji

This tiny CLI tool automatically adds an emoji to your commit messages based on conventional commit types.

It runs with the `prepare-commit-msg` git hook (every time your make a commit) and modifies your commit messages.

## 😎 Emojis

Hi, read the `README.md` first (starting with [Install](#-install)). This emoji table is for quick reference.

<details open>
<summary><b>Close/open gigantic table</b></summary>

| Type | Subtype | Emoji | Description |
| ---- | ------- | ----- | ----------- |
| `fix` | `.` | 🔧 | general fix |
| `fix` | `typo` | ✏️ | fixed typo in code, docs, ui, etc. |
| `fix` | `bug` | 🐛 | fixed a bug |
| `chore` | `.` | 🗑️ | did some chores |
| `chore` | `release` | 🔖 | new release commit (pairs well with [bumpp](https://github.com/antfu/bumpp) and [changelogithub](https://github.com/antfu/changelogithub)) |
| `chore` | `cleanup` | 🧹 | cleaned up code, removed logs and debug stuff, making things ready for production |
| `chore` | `license` | 📜 | changed the license |
| `chore` | `lint` | 🧼 | fixed linting errors |
| `chore` | `deps` | 📦 | updated dependencies |
| `chore` | `readme` | 📕,📗,📘,📙 | update the README |
| `release` | | 🔖 | |
| `cleanup` | | 🧹 | |
| `lint` | | 🧼 | |
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

There are two different ways to install `eemoji`:

- [Locally](#local): add it to a node project as a dev dependency. This way you can share it with other contributors.
- [Globally](#global): install it globally to use it everywhere, <u>not just in node projects</u>. Note that you will need to initialize it in other repository for it to work there.

Thanks to the `postinstall` script, after installing `eemoji` locally/globally, it will automatically create the git hook for the current repo. This means it will just work, but it's especially useful when other users are going to contribute to your repository.

### Local

```bash
npm i -D eemoji
```

### Global

```bash
npm i -g eemoji
```

> **Note**
> For `eemoji` to work in a repository you still need to run the init command once, so that it can install the git hook there as well.

## 📖 Usage

After installing it, just create a commit and see an emoji appended to it.

Go to the [Config](#-config) section for [examples](#simple-demonstration) and to see how to customize it.

Use `eemoji <command>` if you installed it globally, or `npx eemoji <command>` if you installed it locally.

### Commands

Use the help command to see all available commands and flags.

`eemoji -h` or `eemoji --help`

In addition, check the version with `eemoji --version`.

#### 🚩 Init

Installs the git hook in the current repository.

It will also ask you what type of config file you want to use, see [Config](#-config).

The `postinstall` script will run this command with the `-c none` flag, so no config is assumed.

```bash
eemoji init
```

**Flags:**

Specify flags to skip the questions.

- `-c, --config <config>`: specify the config type, `json`, `ts` or `none`

#### 🧹 Cleanup

Removes `eemoji` from the current repository, including the git hook, config file and its vscode settings if present.

```bash
eemoji cleanup
```

#### 🥏 Run

Runs the `eemoji` on the current commit message manually.

This is used by the git hook, but you can also test it manually (specify a test file or it will use the current commit message in `.git/COMMIT_EDITMSG`).

```bash
eemoji run
```

**Arguments:**

- `commit_file`: the file to run emoji on, defaults to `.git/COMMIT_EDITMSG`

**Flags:**

- `-d, --debug`: the debug level, `0` for none, `1` for some, `2` for all

## 🦾 Config

The default configuration is here: [emojis.json](./src/emojis.json) and the [Emojis](#-emojis) section.

This is used if no config file is found in the project.

Apart from emojis, the config also specifies the format of the commit message, see [Format](#format).

`eemoji` can be configured two different ways: [json](#json-config) and [typescript](#ts-config) config files.

### TS Config

This way your emojis will be merged with the default ones.

Use the `init` command and select the `ts` config type.

`eemoji` will look for these config files:

- `eemoji.config.ts`

<details>
<summary><b>See all ...</b></summary>

- `.eemojirc.{js,ts,cjs,mjs}`
- `eemoji.config.{js,ts,cjs,mjs}`
- `.config/eemoji.config.{js,ts,cjs}`

</details>

#### Format

The format specifies how the commit message will be formatted (`{emoji} {type}: {subject}` is the default format btw, this property is optional here).

- `{type}`: this determines the emoji
- `{subject}`: rest of the commit message
- `{emoji}`: the place of the emoji to be inserted

Some other formats I could think of:

- `{emoji} {type} - {subject}`
- `{emoji} {type} {subject}`
- `{type}: {emoji} {subject}`

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

#### Nested emojis

You can also nest emojis to create subtypes. After finding the type, `eemoji` will look for subtypes in the commit message.

Either using conventional commit scopes or just including the subtype in the commit message will work.

You can specify multiple emojis by separating them with commas and a **random** one will be chosen.

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

Use the `init` command and select the `json` config type to generate a config file.

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
