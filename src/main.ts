import * as fs from 'node:fs'
import process from 'node:process'
import { defineCommand, runMain } from 'citty'
import { consola } from 'consola'
import { cosmiconfig } from 'cosmiconfig'
import { description, name, version } from '../package.json'
import { type Config, ConfigObject } from './config'

const C = new ConfigObject()
let DEBUG = 0

export const main = defineCommand({
  meta: {
    name,
    version,
    description,
  },
  async run() {
    consola.info(`Eemoji ${version} 😎\n`)

    checkGitHook()
    checkJsonSchema()

    try {
      const config = await loadConfig()

      let commitMessageFilePath: string
      if (process.argv[2] === '.')
        commitMessageFilePath = '.git/COMMIT_EDITMSG'
      else
        commitMessageFilePath = process.argv[2] ?? '.git/COMMIT_EDITMSG'

      const commitMessage = fs.readFileSync(commitMessageFilePath, 'utf-8')
      const firstLine = commitMessage.split('\n')[0] ?? ''
      DEBUG = Number(process.argv[3]) ?? 0

      if (DEBUG >= 2) {
        process.argv.forEach((arg, i) => {
          consola.log(`argv[${i}]: ${arg}`)
        })
      }

      const newCommitMessage = eemojify(firstLine, config)

      fs.writeFileSync(commitMessageFilePath, newCommitMessage)
    }
    catch (err: any) {
      consola.error(err)
    }
  },
})

async function loadConfig(): Promise<Config> {
  const explorer = cosmiconfig(name, {
    searchPlaces: [
      ...C.jsonFiles,
      ...C.jsFiles,
    ],
  })

  const result = await explorer.search()
  let config: Config

  if (result)
    config = result.config
  else
    config = C.defaultConfig

  if (!config.format)
    throw new Error('Format missing in config file.')
  else if (!config.format.match(/{emoji}|{type}|{subject}/g))
    throw new Error('Invalid format specified in config file.')

  return config
}

export function eemojify(text: string, config: Config): string {
  // the separator is whatever character remains after removing the format placeholders, or a space
  const separator = config.format.replace(/{emoji}|{type}|{subject}/g, '').trim() || ' '

  const separatorIndex = text.indexOf(separator)
  const type = text.substring(0, separatorIndex).trim()
  const subject = text.substring(separatorIndex + separator.length).trim()

  if (DEBUG >= 2)
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

function checkGitHook() {
  const hookContent = '#!/bin/sh\n'
    + 'npx eemoji $1\n'

  if (!fs.existsSync(C.hooksDir)) {
    fs.mkdirSync(C.hooksDir)
    consola.success('Created: .git/hooks')
  }

  try {
    const content = fs.readFileSync(C.hookFile, 'utf-8')
    if (!content.includes('eemoji'))
      fs.appendFileSync(C.hookFile, hookContent)
  }
  catch (err: any) {
    if (err.code === 'ENOENT') {
      fs.writeFileSync(C.hookFile, hookContent)
      fs.chmodSync(C.hookFile, '755')
    }
    else { consola.error(err) }
  }
}

function checkJsonSchema() {
  const vscodeSettingsFile = '.vscode/settings.json'

  try {
    const content = JSON.parse(fs.readFileSync(vscodeSettingsFile, 'utf-8'))

    // Check if 'json.schemas' property exists, if not, initialize it
    if (!content['json.schemas'])
      content['json.schemas'] = []

    // Check if the schema is already present, if not, add it
    if (!content['json.schemas'].some(
      (schema: typeof C.vscodeSettings['json.schemas'][0]) => schema.url?.includes(name),
    )) {
      content['json.schemas'].push(C.vscodeSettings['json.schemas'][0])
      fs.writeFileSync(vscodeSettingsFile, JSON.stringify(content, null, 2))
    }
  }
  catch (err: any) {
    if (err.code === 'ENOENT' || err.message.includes('Unexpected end of JSON input'))
      fs.writeFileSync(vscodeSettingsFile, JSON.stringify(C.vscodeSettings, null, 2))

    else consola.error(err)
  }
}

runMain(main)
