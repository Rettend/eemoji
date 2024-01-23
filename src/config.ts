import * as path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import { merge } from 'lodash-es'
import { name } from '../package.json'
import emojis from './emojis.json'

globalThis.__eemoji_pkg__ = globalThis.__eemoji_pkg__ || {
  entryDir: dirname(fileURLToPath(import.meta.url)),
}

type PipePropName<T> = T extends `${infer First}|${infer _}` ? First : T

type StringOrOptionalProp<T> = {
  [K in keyof T as K extends 'breaking' ? never :
    PipePropName<K>]: T[K] | Record<string, string>
} | Record<string, string | Record<string, string>>

type EmojiType = StringOrOptionalProp<typeof emojis> & { breaking?: string }

export interface Config {
  format: string
  strict: boolean
  emojis: EmojiType
}

export const configTypes = [
  'ts',
  'json',
  'none',
] as const

export type ConfigType = typeof configTypes[number]
export type JsFiles = typeof ConfigObject.prototype.jsFiles[number]
export type JsonFiles = typeof ConfigObject.prototype.jsonFiles[number]

export class ConfigObject {
  defaultConfig = {
    format: '{emoji} {type}: {subject}',
    strict: true,
    emojis,
  } satisfies Config

  defaultTsConfig = `import { defineConfig } from 'eemoji'

export default defineConfig({
  format: '{emoji} {type}: {subject}', // this is the default format (you can remove it or change it)
  emojis: {}, // this gets merged with the default emojis (use it to override emojis or add new ones)
})
`

  jsFiles = [
    `${name}.config.ts`, // recommended
    `.${name}rc.js`,
    `.${name}rc.ts`,
    `.${name}rc.mjs`,
    `.${name}rc.cjs`,
    `.config/${name}rc.js`,
    `.config/${name}rc.ts`,
    `.config/${name}rc.cjs`,
    `${name}.config.js`,
    `${name}.config.mjs`,
    `${name}.config.cjs`,
  ] as const

  jsonFiles = [
    `.${name}rc.json`, // recommended
    'package.json',
    `.${name}rc`,
    `.${name}rc.yaml`,
    `.${name}rc.yml`,
    `.config/${name}rc`,
    `.config/${name}rc.json`,
    `.config/${name}rc.yaml`,
    `.config/${name}rc.yml`,
  ] as const

  vscodeSettings = {
    'json.schemas': [
      {
        fileMatch: [
          ...this.jsonFiles.filter(file => file !== 'package.json'),
        ],
        url: `https://rettend.github.io/${name}/${name}-config-schema.json`,
      },
    ],
  }

  cwd = process.env.INIT_CWD || process.cwd()
  vscodeSettingsFile = path.join(this.cwd, '.vscode/settings.json')
  gitCommitFile = path.join(this.cwd, '.git/COMMIT_EDITMSG')
  hooksDir = path.join(this.cwd, '.git/hooks')
  hookFile = path.join(this.cwd, '.git/hooks/prepare-commit-msg')
  entryFile = path.join(globalThis.__eemoji_pkg__.entryDir, 'hook.sh')
}

export function defineConfig(config: Partial<Config>): Config {
  const defaultConfig = new ConfigObject().defaultConfig

  return merge({}, defaultConfig, config)
}
