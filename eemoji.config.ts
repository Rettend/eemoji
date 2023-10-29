import { defineConfig } from 'eemoji'

export default defineConfig({
  format: '{emoji} {type}: {subject}',
  emojis: {
    fix: '🐛',
    chore: {
      '.': '🧹',
      'release': '🔖',
    },
    cleanup: '🤢',
    docs: '✏️',
    breaking: '🚨',
  },
})
