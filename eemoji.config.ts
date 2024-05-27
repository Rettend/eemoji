/* eslint-disable antfu/no-import-dist */
import { defineDefaultConfig } from './dist/index.mjs'

export default defineDefaultConfig({
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
    chore: {
      emojis: '👍',
    },
  },
})
