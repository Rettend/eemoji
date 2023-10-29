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
      consola.log(`config: ${JSON.stringify(result?.config)}`)

      if (result)
        config = result.config
      else
        config = C.defaultConfig

      if (!config.format.match(/{emoji}|{type}|{subject}/g))
        throw new Error('Invalid format specified in config file.')

      // modify the commit message
      const commitMessageFilePath = process.argv[2] ?? '.git/COMMIT_EDITMSG'
      const commitMessage = fs.readFileSync(commitMessageFilePath, 'utf-8')
      const firstLine = commitMessage.split('\n')[0] ?? ''

      // the separator is whatever character remains after removing the format placeholders,
      // if nothing remains, then the separator is a space
      const separator = config.format.replace(/{emoji}|{type}|{subject}/g, '').trim() || ' '

      let [type, subject] = firstLine.split(separator)
      type = type?.trim()
      subject = subject?.trim()

      if (!type || !subject) {
        consola.warn(`Invalid commit message: ${firstLine}`)
        throw new Error('Invalid commit message.')
      }

      const emoji = config.emojis[type.toLowerCase()]
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

runMain(main)

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
  // PLAN B: "url": "./node_modules/eemoji/eemoji-config-schema.json"

  try {
    const content = JSON.parse(fs.readFileSync(vscodeSettingsFile, 'utf-8'))

    consola.log(`file: ${content}`)
    if (!content)
      throw new Error('Invalid JSON.')

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
