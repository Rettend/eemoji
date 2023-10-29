import { name } from '../package.json'
import emojis from './emojis.json'

export interface Config {
  format: string
  emojis: {
    [key: string]: string | Record<string, string>
  }
}

export class ConfigObject {
  defaultConfig: Config = {
    format: '{emoji} {type}: {subject}',
    emojis,
  }

  jsFiles = [
    `.${name}rc.js`,
    `.${name}rc.ts`,
    `.${name}rc.mjs`,
    `.${name}rc.cjs`,
    `.config/${name}rc.js`,
    `.config/${name}rc.ts`,
    `.config/${name}rc.cjs`,
    `${name}.config.js`,
    `${name}.config.ts`,
    `${name}.config.mjs`,
    `${name}.config.cjs`,
  ]

  jsonFiles = [
    'package.json',
    `.${name}rc`,
    `.${name}rc.json`,
    `.${name}rc.yaml`,
    `.${name}rc.yml`,
    `.config/${name}rc`,
    `.config/${name}rc.json`,
    `.config/${name}rc.yaml`,
    `.config/${name}rc.yml`,
  ]

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

  vscodeSettingsFile = '.vscode/settings.json'
  hooksDir = '.git/hooks'
  hookFile = '.git/hooks/prepare-commit-msg'
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
