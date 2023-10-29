import { name } from '../package.json' assert { type: 'json' }

export interface Config {
  format: string
  override?: boolean
  emojis: {
    [key: string]: string
  }
}

export const defaultConfig: Config = {
  format: '{emoji} {type}: {subject}',
  emojis: {
    fix: '🔧',
    feat: '✨',
    docs: '📝',
    test: '🧪',
    refactor: '♻️',
    chore: '🗑️',
    init: '🎉',
    deps: '📦',
    style: '🎨',
    lint: '🎨',
    perf: '⚡',
    revert: '⏪',
    cleanup: '🧹',
    ci: '🤖',
    add: '➕',
    remove: '➖',
    wip: '🚧',
  },
}

export function defineConfig(config: Partial<Config>): Config {
  if (config.override) {
    return {
      ...defaultConfig,
      ...config,
      emojis: {
        ...config.emojis,
      },
    }
  }
  else {
    return {
      ...defaultConfig,
      ...config,
      emojis: {
        ...defaultConfig.emojis,
        ...config.emojis,
      },
    }
  }
}

export const vscodeSettings = {
  'json.schemas': [
    {
      fileMatch: [
        'package.json',
        `.${name}rc`,
        `.${name}rc.json`,
        `.${name}rc.yaml`,
        `.${name}rc.yml`,
        `.config/${name}rc`,
        `.config/${name}rc.json`,
        `.config/${name}rc.yaml`,
        `.config/${name}rc.yml`,
      ],
      url: `https://rettend.github.io/${name}/${name}-config-schema.json`,
    },
  ],
}
