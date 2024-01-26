import * as fs from 'node:fs'
import process from 'node:process'
import { defineCommand } from 'citty'
import { consola } from 'consola'
import { cosmiconfig } from 'cosmiconfig'
import { name } from '../../package.json'
import { createExampleCommitMessage, eemojify, unemojify } from '../eemoji'
import { type Config, ConfigObject } from '../config'

const C = new ConfigObject()

export default defineCommand({
  meta: {
    name: 'run',
    description: 'Run eemoji on the commit message',
  },
  args: {
    commit_file: {
      type: 'positional',
      description: 'Commit message file path',
      default: C.gitCommitFile,
    },
    DEBUG: {
      type: 'string',
      description: 'Debug level (0-2)',
      alias: 'd',
      default: '0',
    },
    test: {
      type: 'boolean',
      description: 'Test mode (input a commit message instead of a file path)',
      alias: 't',
      default: false,
    },
  },
  async run(ctx) {
    const DEBUG = Number(ctx.args.DEBUG)

    try {
      const config = await loadConfig()
      let commitMessage: string

      if (DEBUG >= 2) {
        process.argv.forEach((arg, i) => {
          consola.log(`argv[${i}]: ${arg}`)
        })
      }

      if (ctx.args.test) {
        let initial = createExampleCommitMessage(config)

        if (fs.existsSync(ctx.args.commit_file)) {
          initial = unemojify(fs.readFileSync(ctx.args.commit_file, 'utf-8'), config)
          initial = initial.split('\n')[0] ?? ''
        }

        commitMessage = await consola.prompt('Commit message:', {
          placeholder: 'enter a commit message for testing...',
          initial,
        })

        if (commitMessage) {
          const newCommitMessage = eemojify(commitMessage, config, DEBUG)

          consola.log(`\n${newCommitMessage}`)

          fs.writeFileSync(ctx.args.commit_file, newCommitMessage)
        }
      }
      else {
        commitMessage = fs.readFileSync(ctx.args.commit_file, 'utf-8')
        commitMessage = commitMessage.split('\n')[0] ?? ''

        const newCommitMessage = eemojify(commitMessage, config, DEBUG)

        fs.writeFileSync(ctx.args.commit_file, newCommitMessage)
      }
    }
    catch (err: any) {
      fs.writeFileSync(C.statusFile, '1')
      consola.error(err.message)
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
