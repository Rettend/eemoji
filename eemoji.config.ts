import { defineConfig } from './dist/index.mjs'

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
  },
})
