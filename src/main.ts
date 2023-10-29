import * as fs from 'node:fs'
import process from 'node:process'
import { defineCommand, runMain } from 'citty'
import { consola } from 'consola'
import { cosmiconfig } from 'cosmiconfig'
import { description, name, version } from '../package.json' assert { type: 'json' }
import { type Config, defaultConfig } from './config'

export const main = defineCommand({
  meta: {
    name,
    version,
    description,
  },
  async run() {
    consola.info(`Eemoji ${version} 😎\n`)

    // create git hook
    const hooksDir = '.git/hooks'
    const hookFile = '.git/hooks/prepare-commit-msg'

    const hookContent = '#!/bin/sh\n'
      + 'npx eemoji $1\n'

    if (!fs.existsSync(hooksDir)) {
      fs.mkdirSync(hooksDir)
      consola.success('Created: .git/hooks')
    }

    try {
      const content = fs.readFileSync(hookFile, 'utf-8')
      if (!content.includes('eemoji'))
        fs.appendFileSync(hookFile, hookContent)
    }
    catch (err: any) {
      if (err.code === 'ENOENT') {
        fs.writeFileSync(hookFile, hookContent)
        fs.chmodSync(hookFile, '755')
      }
      else { consola.error(err) }
    }

    const explorer = cosmiconfig(name, {
      searchPlaces: [
        `.${name}rc.js`,
        `.${name}rc.ts`,
        `.${name}rc.mjs`,
        `.${name}rc.cjs`,
        `.config/${name}rc.js`,
        `.config/${name}rc.ts`,
        `.config/${name}rc.cjs`,
        `${name}.config.js`,
        `${name}.config.ts`,
        `${name}.config.mjs`,
        `${name}.config.cjs`,
      ],
    })

    try {
      // load config
      const result = await explorer.search()
      let config: Config

      if (result)
        config = result.config
      else
        config = defaultConfig

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
