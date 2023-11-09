import { consola } from 'consola'
import { type Config } from './../config'

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

  let emoji: string | Record<string, string> | undefined

  // if there is an exclamatory mark, then it's a breaking change
  if (text.includes('!') && config.emojis.breaking)
    emoji = config.emojis.breaking
  else
    emoji = config.emojis[type.toLowerCase().replace(/\(.*\)/, '')]

  // if the emoji is an object, then it's a nested emoji
  if (typeof emoji === 'object') {
    emoji = getNestedEmoji(text, emoji)
    if (DEBUG)
      consola.log(`nested emoji: "${emoji}"`)
  }
  else if (DEBUG) {
    consola.log(`emoji: "${emoji}"`)
  }

  if (!emoji)
    throw new Error(`Emoji for type "${type}" not found.`)

  if (emoji.includes(','))
    emoji = emoji.trim().split(',')[Math.floor(Math.random() * emoji.split(',').length)] ?? emoji

  return config.format
    .replace('{emoji}', emoji)
    .replace('{type}', type)
    .replace('{subject}', subject)
}

function getNestedEmoji(text: string, emoji: Record<string, string>): string | undefined {
  const entries = Object.entries(emoji).filter(([key]) => key !== '.')

  for (const [key, value] of entries) {
    if (text.includes(key))
      return value
  }

  return emoji['.']
}
