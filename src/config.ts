import { consola } from 'consola'

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
    ci: '🤖',
    add: '➕',
    remove: '➖',
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
    consola.warn('no override')
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
