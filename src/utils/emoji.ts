import { consola } from 'consola'
import type { Config } from '../config'

/**
 * Formats a commit message with an emoji based on the type.
 *
 * @param text - The whole commit message text.
 * @param config - The configuration object containing the format and emojis.
 * @param DEBUG - Optional debug level (0=off, 1=some, 2=all)
 * @returns The formatted commit message.
 * @throws Error if the commit message is invalid or if the emoji for the given type is not found.
 * @example
 * `feat: add new feature`
 *
 * becomes
 *
 * `✨ feat: add new feature`
 */
export function eemojify(text: string, config: Config, DEBUG?: number): string {
  // the separator is whatever character remains after removing the format placeholders, or a space
  const separator = config.format.replace(/{emoji}|{type}|{subject}/g, '').trim() || ' '

  const separatorIndex = text.indexOf(separator)
  const type = text.substring(0, separatorIndex).trim()
  const subject = text.substring(separatorIndex + separator.length).trim()

  if (DEBUG && DEBUG >= 2)
    consola.log(`\nconfig: ${JSON.stringify(config)}\n`)

  if (DEBUG) {
    consola.log(`separator: "${separator}"`)
    consola.log(`type: "${type}"`)
    consola.log(`subject: "${subject}"`)
  }

  if (!type || !subject)
    throw new Error('Invalid commit message.')

  let emoji = getEmoji(type, text, config, DEBUG)
  consola.log('emoji')

  if (DEBUG)
    consola.log(`emoji: "${emoji}"`)

  if (!emoji)
    throw new Error(`Emoji for type "${type}" not found.`)

  if (emoji.includes(','))
    emoji = emoji.trim().split(',')[Math.floor(Math.random() * emoji.split(',').length)] ?? emoji

  return config.format
    .replace('{emoji}', emoji)
    .replace('{type}', type)
    .replace('{subject}', subject)
}

function getEmoji(type: string, text: string, config: Config, DEBUG?: number): string | undefined {
  if (text.includes('!') && config.emojis.breaking)
    return config.emojis.breaking

  type = type.toLowerCase().replace(/\(.*\)/, '').trim()
  const emojiKey = Object.keys(config.emojis).find(key => key.split('|').includes(type))

  if (!emojiKey)
    return undefined

  const emoji = config.emojis[emojiKey as keyof Config['emojis']]

  if (typeof emoji === 'object') {
    if (DEBUG)
      consola.log(`nested emoji: ${JSON.stringify(emoji)}`)

    const entries = Object.entries(emoji).filter(([key]) => key !== '.')
    text = text.toLowerCase()

    for (const [key, value] of entries) {
      if (key.split('|').some(k => text.includes(k.toLowerCase())))
        return value
    }

    return emoji['.']
  }
  else if (typeof emoji === 'string') {
    return emoji
  }
  else {
    return undefined
  }
}

export function unemojify(text: string, config: Config): string {
  const values = Object.values(config.emojis).flatMap(
    value => typeof value === 'object' ? Object.values(value) : value,
  ).join('|').replace(/,/g, '|')

  const regex = new RegExp(`(${values})`, 'gi')

  return text.replace(regex, '').trim()
}

export function createExampleCommitMessage(config: Config): string {
  const type = Object.keys(config.emojis)[0]
  let emoji = Object.values(config.emojis)[0]
  const subject = 'add new feature'

  if (typeof emoji === 'object')
    emoji = Object.values(emoji)[0]

  if (!type || !emoji)
    return ''

  return config.format
    .replace('{emoji}', emoji)
    .replace('{type}', type)
    .replace('{subject}', subject)
}
