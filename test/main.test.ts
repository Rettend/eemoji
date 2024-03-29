import { describe, expect, it } from 'vitest'
import { eemojify, unemojify } from '../src/eemoji'
import { type Config, ConfigObject } from '../src/config'

const C = new ConfigObject()

const customConfig = {
  format: '{type} {emoji} - {subject}',
  strict: true,
  emojis: {
    fix: '🔨', // override nested emoji with a single one
    feat: {
      '.': '🚀',
      'frontend': '🪟', // override nested emoji with a custom object
      'backend': '🧱',
    },
    docs: '📚',
    breaking: '🚨',
    test: { // override nested emoji and skip the default (.) emoji
      unit: '🧪',
      e2e: '⚗️',
    },
    test2: { // create a nested emoji and skip the default (.) emoji
      unit: '🧪',
      e2e: '⚗️',
    },
  },
} satisfies Config

describe('eemojify with default config', () => {
  it('should return the correct emoji for a feat type', () => {
    expect(eemojify('feat: add new feature', C.defaultConfig)).toBe('✨ feat: add new feature')
  })

  it('should return the correct emoji for a fix type', () => {
    expect(eemojify('fix: navbar issue', C.defaultConfig)).toBe('🔧 fix: navbar issue')
  })

  it('should return the correct emoji for a nested fix type', () => {
    expect(eemojify('fix: typo in readme', C.defaultConfig)).toBe('✏️ fix: typo in readme')
  })

  it('should return the correct emoji for a nested emoji type (scope syntax)', () => {
    expect(eemojify('chore(release): bump version', C.defaultConfig)).toBe('🔖 chore(release): bump version')
  })

  it('should return the correct emoji for a breaking change type', () => {
    expect(eemojify('feat!: remove deprecated feature', C.defaultConfig)).toBe('💥 feat!: remove deprecated feature')
  })

  it('should return the correct emoji for a breaking change type no matter where is the exclamation mark', () => {
    expect(eemojify('feat: remove deprecated feature!', C.defaultConfig)).toBe('💥 feat: remove deprecated feature!')
  })

  it('should throw an error for an invalid commit message', () => {
    expect(() => eemojify('invalid message', C.defaultConfig)).toThrow('Invalid commit message.')
  })

  it('should throw an error for an unknown type', () => {
    expect(() => eemojify('unknown: do something', C.defaultConfig)).toThrow('Emoji for type "unknown" not found.')
  })
})

describe('eemojify with custom config', () => {
  it('should return the correct emoji when overriding a nested emoji with a single one', () => {
    expect(eemojify('fix - typo in readme', customConfig)).toBe('fix 🔨 - typo in readme')
  })

  it('should return the correct default (.) emoji when overriding a nested emoji with a custom object', () => {
    expect(eemojify('feat - add new feature', customConfig)).toBe('feat 🚀 - add new feature')
  })

  it('should return the correct custom emoji when overriding a nested emoji with a custom object', () => {
    expect(eemojify('feat(frontend) - add new feature', customConfig)).toBe('feat(frontend) 🪟 - add new feature')
  })

  it('should return the correct emoji when overriding a nested emoji with a custom object and skipping the default (.) emoji', () => {
    expect(eemojify('test(unit) - add new feature', customConfig)).toBe('test(unit) 🧪 - add new feature')
  })

  it('should throw an error when overriding a nested emoji with a custom object and skipping the default (.) emoji', () => {
    expect(() => eemojify('test2 - add new feature', customConfig)).toThrow('Emoji for type "test2" not found.')
  })

  it('should return the correct emoji for a breaking change type', () => {
    expect(eemojify('feat! - remove deprecated feature', customConfig)).toBe('feat! 🚨 - remove deprecated feature')
  })

  it('should throw an error for an invalid commit message', () => {
    expect(() => eemojify('invalid message', customConfig)).toThrow('Invalid commit message.')
  })

  it('should throw an error for an unknown type', () => {
    expect(() => eemojify('unknown - do something', customConfig)).toThrow('Emoji for type "unknown" not found.')
  })
})

describe('unemojify', () => {
  it('should work for a single emoji', () => {
    expect(unemojify('🔨 fix: typo in readme', customConfig)).toBe('fix: typo in readme')
  })

  it('should work for a nested emoji', () => {
    expect(unemojify('🚀 fix: typo in readme', customConfig)).toBe('fix: typo in readme')
  })

  it('should work for multiple emojis', () => {
    expect(unemojify('🚀🔨 fix: ty🔨po in🔨 r🔨ea🔨🔨dme', customConfig)).toBe('fix: typo in readme')
  })
})
