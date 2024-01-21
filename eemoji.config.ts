import { type Config, defineConfig } from 'eemoji'

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
