<h1 align="center">
  eemoji
  <br><br>

  [![eemoji](https://img.shields.io/badge/😎%20eemoji-fccf1d?style=for-the-badge)](https://github.com/Rettend/eemoji)
</h1>

This is a tiny CLI tool that automatically adds emojis to your commit messages based on conventional commit types.

- 📦 Easy Install: just install it once and forget about it
- 🛠️ Customizable: you can add your own emojis and trigger words, and change the format of the commit message as per your needs.
- 🫧 Seamless: operates with the `prepare-commit-msg` git hook, modifying your commit messages every time you make a commit.

> [!WARNING]
> There is a [known issue](#️-known-issues) with GitHub Desktop on Windows.

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
| `chore` | `release` | 🔖 | new release commit (pairs well with [bumpp](https://github.com/antfu/bumpp)) |
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
| `build` | `.` | 🦺 | work regarding build processes |
| `build` | `deps` | 📦 | dependabot PRs |
| `docs` | `.` | 📝 | documented something |
| `docs` | `readme` | 📕,📗,📘,📙 | |
| `feat` | `.` | ✨ | introduced a new feature |
| `feat` | `enhance` | 💎 | made something a little better (but still include in release notes) |
| `enhance` | | 💎 | made something a little better (omit from release notes) |
| `test` | | 🧪 | worked on tests |
| `refactor` | | ♻️ | refactored code, achieved the same with less |
| `init` &#124; `initial` | | 🎉 | started a new project! |
| `perf` | | ⚡ | improved performance, achieve the same faster |
| `config` | | ⚙️ | changed configuration files |
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

> [!TIP]
> If you use `yarn` or `pnpm`, which do not run `postinstall` scripts by default, you need to run `eemoji init` manually.
> Besides that, you can create a `prepare` script in your `package.json`, so that it will be run automatically for others who contribute to your repository:
>
> ```json
> {
>   "scripts": {
>     "prepare": "eemoji init -c none"
>   }
> }

### Local

```bash
npm i -D eemoji
```

### Global

```bash
npm i -g eemoji
```

> [!NOTE]
> For `eemoji` to work in a repository you still need to run the init command once, so that it can install the git hook there as well.

## 📖 Usage

**After installing it, just create a commit and see an emoji appended to it.**

Go to the [Config](#-config) section for [examples](#simple-demonstration) and to see how to customize it.

The cli tool also has some commands for removing `eemoji` from a repository, running it manually, etc. But they are not that important. 👇

### Commands

Use `eemoji <command>` if you installed it globally, or `npx eemoji <command>` if you installed it locally.

- `-h, --help`: show help for a command
- `-v, --version`: show version

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

This is used by the git hook, but also allows you to test `eemoji` manually (specify a test file or it will use the current commit message in `.git/COMMIT_EDITMSG`).

```bash
eemoji run
```

**Arguments:**

- `commit_file`: the file to run emoji on, defaults to `.git/COMMIT_EDITMSG`

**Flags:**

- `-d, --debug`: the debug level, `0` for none, `1` for some, `2` for all
- `-t, --test`: test mode, input a commit message instead of a file

## 🦾 Config

The default configuration is here: [emojis.json](./src/emojis.json) and the [Emojis](#-emojis) section.

This is used if no config file is found in the project.

Apart from emojis, the config also specifies other things, like:

- `format`: the format of the commit message, see [Format](#format).
- `strict`: enforce formatting, and only allow commits with emojis (default: `true`)

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

You can also nest emojis to create subtypes.

After finding the type, `eemoji` will look for subtypes in the commit message.

This is useful for conventional commit scopes, but you can include the subtype anywhere in the commit message.

Notes:

- the `'.'` is the fallback subtype
- specify multiple aliases for a type by separating them with pipes: `feat|feature`
- specify multiple emojis by separating them with commas and a **random** one will be chosen: `💎,💲,💸,💰`

```ts
import { defineConfig } from 'eemoji'

export default defineConfig({
  emojis: {
    'fix': {
      '.': '🔧',
      'typo': '✏️',
      'bug': '🐛'
    },
    'chore': {
      '.': '🗑️',
      'release': '🔖',
      'cleanup': '🧹',
      'license': '📜',
      'deps': '📦'
    },
    'feat|feature': '✨',
    'bounty': '💎,💲,💸,💰'
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

> [!IMPORTANT]
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

## ⚠️ Known issues

**`eemoji` WILL NOT work with GitHub Desktop on Windows <u>unless you do this</u>.**

This sucks, but this is an [open issue](https://github.com/desktop/desktop/issues/12562#issuecomment-1444580040) with GitHub Desktop.

Follow these steps:

- Move `C:\Program Files\Git\cmd` to the top of your system `PATH`
- Add `C:\Program Files\Git\bin` just below that
- Restart GitHub Desktop

If it continues to fail to work, try this as well and restart everything:

- Run this command once: `git config stash.usebuiltin false`

## 💛 Badge

[![eemoji](https://img.shields.io/badge/😎%20eemoji-fccf1d?style=for-the-badge)](  https://github.com/Rettend/eemoji)

```md
[![eemoji](https://img.shields.io/badge/😎%20eemoji-fccf1d?style=for-the-badge)](
  https://github.com/Rettend/eemoji)
```

## 📜 License

[MIT](./LICENSE)
