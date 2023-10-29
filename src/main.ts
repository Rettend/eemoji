import * as fs from 'node:fs'
import process from 'node:process'
import { defineCommand, runMain } from 'citty'
import { consola } from 'consola'
import { cosmiconfig } from 'cosmiconfig'
import { description, name, version } from '../package.json' assert { type: 'json' }
import { type Config, ConfigObject } from './config'

const C = new ConfigObject()

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

    const explorer = cosmiconfig(name, {
      searchPlaces: [
        ...C.jsonFiles,
        ...C.jsFiles,
      ],
    })

    try {
      // load config
      const result = await explorer.search()
      let config: Config

      consola.log(`file: ${result?.filepath}`)
      consola.log(`config: ${JSON.stringify(result?.config, null, 2)}`)

      if (result)
        config = result.config
      else
        config = C.defaultConfig

      if (!config.format)
        throw new Error('Format missing in config file.')
      else if (!config.format.match(/{emoji}|{type}|{subject}/g))
        throw new Error('Invalid format specified in config file.')

      // modify the commit message
      const commitMessageFilePath = process.argv[2] ?? '.git/COMMIT_EDITMSG'
      const commitMessage = fs.readFileSync(commitMessageFilePath, 'utf-8')
      const firstLine = commitMessage.split('\n')[0] ?? ''

      // the separator is whatever character remains after removing the format placeholders, or a space
      const separator = config.format.replace(/{emoji}|{type}|{subject}/g, '').trim() || ' '

      let [type, subject] = firstLine.split(separator)
      type = type?.trim()
      subject = subject?.trim()

      consola.log(`type: ${type}`)
      consola.log(`subject: ${subject}`)

      if (!type || !subject) {
        consola.warn(`Invalid commit message: ${firstLine}`)
        throw new Error('Invalid commit message.')
      }

      let emoji: string | Record<string, string> | undefined

      // if there is an exclamatory mark, then it's a breaking change
      if (firstLine.includes('!') && config.emojis.breaking)
        emoji = config.emojis.breaking
      else
        emoji = config.emojis[type.toLowerCase().replace(/\(.*\)/, '')]

      // if the emoji is an object, then it's a nested emoji
      if (typeof emoji === 'object')
        emoji = getNestedEmoji(firstLine, emoji)

      if (!emoji)
        throw new Error(`Emoji for type "${type}" not found.`)

      const newCommitMessage = config.format
        .replace('{emoji}', emoji)
        .replace('{type}', type)
        .replace('{subject}', subject)

      fs.writeFileSync(commitMessageFilePath, newCommitMessage)
    }
    catch (err: any) {
      consola.error(err)
    }
  },
})

// get the first nested emoji that is found in the commit message
// example of a config with nested emojis:
// "fix": {
//   ".": "🔧",
//   "typo": "✏️",
//   "bug": "🐛"
// },
// "feat": "✨",
// "docs": "📝",
// "test": "🧪",
// "refactor": "♻️",
// 1. we iterate over the entries of the object and check if the commit message contains any of the keys (without the dot)
// 2. if it does, then we return the value of that key
// 3. if it doesn't, we return the dot key

function getNestedEmoji(text: string, emoji: Record<string, string>) {
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
