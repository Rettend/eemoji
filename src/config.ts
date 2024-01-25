import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isArray, merge } from 'lodash-es'
import { name } from '../package.json'
import { r } from './utils/utils'
import emojis from './presets/default.json'

const entryDir = path.dirname(fileURLToPath(
  new URL(
    import.meta.url.endsWith('.ts')
      ? '../bin/eemoji.mjs'
      : '../../bin/eemoji.mjs',
    import.meta.url,
  ),
))

type PipePropName<T> = T extends `${infer First}|${infer _}` ? First : T

type StringOrOptionalProp<T> = {
  [K in keyof T as K extends 'breaking' ? never :
    PipePropName<K>]: T[K] | Record<string, string>
}

type EmojiType = StringOrOptionalProp<typeof emojis> & { breaking: string }
export type EmojiConfig = Record<string, string | Record<string, string>>

type DefineConfig = Partial<{
  format: string
  strict: boolean
  emojis: EmojiType | EmojiConfig | EmojiConfig[]
}>

export type Config = Required<{
  [K in keyof DefineConfig]: DefineConfig[K] extends infer U
    ? U extends unknown[] ? never : U
    : never
}>

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

  defaultTsConfig = `import { defineDefaultConfig } from 'eemoji'

export default defineDefaultConfig({
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

  vscodeSettingsFile = r('.vscode/settings.json')
  gitCommitFile = r('.git/COMMIT_EDITMSG')
  hooksDir = r('.git/hooks')
  hookFile = r('.git/hooks/prepare-commit-msg')
  entryDir = entryDir
  entryFile = path.join(this.entryDir, 'hook.sh')
}

export function defineConfig(config: DefineConfig): Config {
  const defaultConfig = new ConfigObject().defaultConfig
  const emojis = mergeEmojis(config.emojis) || defaultConfig.emojis

  return {
    ...defaultConfig,
    ...config,
    emojis,
  }
}

export function defineDefaultConfig(config: DefineConfig): Config {
  const defaultConfig = new ConfigObject().defaultConfig
  const emojis = mergeEmojis(config.emojis)

  return merge({}, defaultConfig, config, { emojis })
}

function mergeEmojis(emojis: DefineConfig['emojis']): EmojiConfig {
  if (isArray(emojis))
    return emojis.reduce((acc, cur) => merge(acc, cur), {})

  return emojis || {}
}
