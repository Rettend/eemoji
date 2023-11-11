import * as path from 'node:path'
import process from 'node:process'
import { name } from '../package.json'
import emojis from './emojis.json'

export interface Config {
  format: string
  emojis: {
    [key: string]: string | Record<string, string>
  }
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
  defaultConfig: Config = {
    format: '{emoji} {type}: {subject}',
    emojis,
  }

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
          ...this.jsonFiles,
        ],
        url: `https://rettend.github.io/${name}/${name}-config-schema.json`,
      },
    ],
  }

  vscodeSettingsFile = path.join(process.env.INIT_CWD || process.cwd(), '.vscode/settings.json')
  hooksDir = path.join(process.env.INIT_CWD || process.cwd(), '.git/hooks')
  hookFile = path.join(process.env.INIT_CWD || process.cwd(), '.git/hooks/prepare-commit-msg')
  gitCommitFile = path.join(process.env.INIT_CWD || process.cwd(), '.git/COMMIT_EDITMSG')
}

export function defineConfig(config: Partial<Config>): Config {
  const defaultConfig = new ConfigObject().defaultConfig

  return {
    ...defaultConfig,
    ...config,
    emojis: {
      ...defaultConfig.emojis,
      ...config.emojis,
    },
  }
}
