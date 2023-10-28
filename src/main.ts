import * as fs from 'node:fs'
import process from 'node:process'
import { defineCommand, runMain } from 'citty'
import { consola } from 'consola'
import { cosmiconfig } from 'cosmiconfig'
import { description, name, version } from '../package.json' assert { type: 'json' }

export interface Config {
  format: string
  emojis: {
    [key: string]: string
  }
}

export const defaultConfig: Config = {
  format: '{emoji} {type}: {subject}',
  emojis: {
    fix: '🔧',
    feat: '✨',
    docs: '📝',
    test: '🧪',
    refactor: '♻️',
    chore: '🗑️',
    init: '🎉',
  },
}

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

    // npx eemoji $1

    const hookContent = '#!/bin/sh\n'
      + 'npx eemoji $1\n'

    if (!fs.existsSync(hooksDir)) {
      fs.mkdirSync(hooksDir)
      consola.success('Created: .git/hooks')
    }

    try {
      const content = fs.readFileSync(hookFile, 'utf-8')
      if (content !== hookContent) {
        fs.writeFileSync(hookFile, hookContent)
        fs.chmodSync(hookFile, '755')
      }
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
        'package.json',
        `.${name}rc`,
        `.${name}rc.json`,
        `.${name}rc.yaml`,
        `.${name}rc.yml`,
        `.${name}rc.js`,
        `.${name}rc.ts`,
        `.${name}rc.mjs`,
        `.${name}rc.cjs`,
        `.config/${name}rc`,
        `.config/${name}rc.json`,
        `.config/${name}rc.yaml`,
        `.config/${name}rc.yml`,
        `.config/${name}rc.js`,
        `.config/${name}rc.ts`,
        `.config/${name}rc.cjs`,
        `${name}.config.js`,
        `${name}.config.ts`,
        `${name}.config.mjs`,
        `${name}.config.cjs`,
      ],
    })
    let result = null
    let config: Config = defaultConfig

    try {
      // load the cosmiconfig file
      result = await explorer.search()
      config = result?.config ?? defaultConfig

      if (!config.format.match(/{emoji}|{type}|{subject}/g))
        throw new Error('Invalid format specified in config file.')

      // modify the commit message
      const commitMessageFilePath = process.argv[2] ?? '.git/COMMIT_EDITMSG'
      const commitMessage = fs.readFileSync(commitMessageFilePath, 'utf-8')
      const firstLine = commitMessage.split('\n')[0] ?? ''

      // split the commit message into type and subject by whatever the format is in the config:
      let [type, subject] = firstLine.split(config.format.replace(/{emoji}|{type}|{subject}/g, '').trim())
      type = type?.trim()
      subject = subject?.trim()

      consola.log(`format: "${config.format.replace(/{emoji}|{type}|{subject}/g, '').trim()}"`)
      consola.log(`type: "${type}"`)
      consola.log(`subject: "${subject}"`)

      if (!type || !subject) {
        consola.warn(`Invalid commit message: ${firstLine}`)
        throw new Error('Invalid commit message.')
      }

      const emoji = config.emojis[type]
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
