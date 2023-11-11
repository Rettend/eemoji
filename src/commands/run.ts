import * as fs from 'node:fs'
import process from 'node:process'
import { defineCommand } from 'citty'
import { consola } from 'consola'
import { cosmiconfig } from 'cosmiconfig'
import { name } from '../../package.json'
import { eemojify } from '../utils/emoji'
import { type Config, ConfigObject } from './../config'

const C = new ConfigObject()

export default defineCommand({
  meta: {
    name: 'run',
    description: 'Run eemoji on the commit message',
  },
  args: {
    commit_file: {
      type: 'positional',
      description: `Commit message file path (default: ${C.gitCommitFile})`,
      default: C.gitCommitFile,
    },
    DEBUG: {
      type: 'string',
      description: 'Debug level (default: 0)',
      alias: 'd',
      default: '0',
    },
  },
  async run(ctx) {
    const DEBUG = Number(ctx.args.DEBUG)

    try {
      const config = await loadConfig()

      const commitMessage = fs.readFileSync(ctx.args.commit_file, 'utf-8')
      const firstLine = commitMessage.split('\n')[0] ?? ''

      if (DEBUG >= 2) {
        process.argv.forEach((arg, i) => {
          consola.log(`argv[${i}]: ${arg}`)
        })
      }

      const newCommitMessage = eemojify(firstLine, config, DEBUG)

      fs.writeFileSync(ctx.args.commit_file, newCommitMessage)
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
