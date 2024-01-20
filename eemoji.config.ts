import { defineConfig } from './dist/index.mjs'

declare type Config = import('./dist/index.d.ts').Config

export default defineConfig({
  emojis: {
    add: {
      '.': '➕',
      'emoji': '😀,😍,😎,🥳,😯,😇,😋,😗,🙂,🤯',
    },
    remove: {
      '.': '➖',
      'emoji': '😭,😵,😴,☹️,😠,😤,😨,😩,😔,😢',
    },
    test: {
      '.': '🧪',
      'eemoji': '👍',
    },
  },
} satisfies Partial<Config>,
)
