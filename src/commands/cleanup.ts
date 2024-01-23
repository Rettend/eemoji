import * as fs from 'node:fs'
import path from 'node:path'
import { defineCommand } from 'citty'
import * as jsonc from 'jsonc-parser'
import { cozy as console } from '@cozy-console/mini'
import { ConfigObject } from '../config'
import { name } from '../../package.json'

const C = new ConfigObject()

export default defineCommand({
  meta: {
    name: 'cleanup',
    description: 'Cleanup git hook and settings.json',
  },
  async run() {
    console.start('Removing git hook...')

    if (fs.existsSync(C.hookFile)) {
      fs.unlinkSync(C.hookFile)
      console.success(`Removed ${C.hookFile}`)
    }
    else {
      console.info(`No ${C.hookFile} found`)
    }

    console.start('Removing VSCode settings...')

    if (fs.existsSync(C.vscodeSettingsFile)) {
      const settings = jsonc.parse(fs.readFileSync(C.vscodeSettingsFile, 'utf-8'))

      if (settings['json.schemas']) {
        settings['json.schemas'] = settings['json.schemas'].filter((schema: any) => {
          return schema.url !== `https://rettend.github.io/${name}/${name}-config-schema.json`
            && schema.url !== `./json/${name}-config-schema.json`
        })

        if (settings['json.schemas'].length === 0)
          delete settings['json.schemas']
      }

      if (Object.keys(settings).length === 0) {
        fs.unlinkSync(C.vscodeSettingsFile)
        fs.rmdirSync(path.dirname(C.vscodeSettingsFile))
        console.success(`Removed ${C.vscodeSettingsFile}`)
      }
      else {
        fs.writeFileSync(C.vscodeSettingsFile, `${JSON.stringify(settings, null, 2)}\n`)
        console.info(`Updated ${C.vscodeSettingsFile}`)
      }
    }
    else {
      console.info(`No ${C.vscodeSettingsFile} found`)
    }

    console.start('Removing config files...')
    let removedFiles = false

    ;[...C.jsFiles, ...C.jsonFiles.filter(file => file !== 'package.json')].forEach((file: string) => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file)
        console.success(`Removed ${file}`)
        removedFiles = true
      }
    })

    if (!removedFiles)
      console.info('No config files found')

    console.success('\nCleanup complete!\n')
  },
})
