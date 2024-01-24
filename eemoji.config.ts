import { defineDefaultConfig } from 'eemoji'

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
      update: '👍',
    },
  },
})
