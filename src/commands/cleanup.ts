import * as fs from 'node:fs'
import path from 'node:path'
import { defineCommand } from 'citty'
import { consola } from 'consola'
import { ConfigObject } from '../config'
import { name } from '../../package.json'

const C = new ConfigObject()

export default defineCommand({
  meta: {
    name: 'cleanup',
    description: 'Cleanup git hook and settings.json',
  },
  async run() {
    // remove git hook
    consola.start('Removing git hook...')

    if (fs.existsSync(C.hookFile)) {
      fs.unlinkSync(C.hookFile)
      consola.success(`Removed ${C.hookFile}`)
    }
    else {
      consola.info(`No ${C.hookFile} found`)
    }

    // remove vscode settings
    if (fs.existsSync(C.vscodeSettingsFile)) {
      const settings = JSON.parse(fs.readFileSync(C.vscodeSettingsFile, 'utf-8'))
      if (settings['json.schemas']) {
        settings['json.schemas'] = settings['json.schemas'].filter((schema: any) => {
          return schema.url !== `https://rettend.github.io/${name}/${name}-config-schema.json`
        })
        if (settings['json.schemas'].length === 0)
          delete settings['json.schemas']
      }
      if (Object.keys(settings).length === 0) {
        fs.unlinkSync(C.vscodeSettingsFile)
        fs.rmdirSync(path.dirname(C.vscodeSettingsFile))
        consola.log(`Removed ${C.vscodeSettingsFile}`)
      }
      else {
        fs.writeFileSync(C.vscodeSettingsFile, JSON.stringify(settings, null, 2))
        consola.log(`Updated ${C.vscodeSettingsFile}`)
      }
    }
    else {
      consola.log(`No ${C.vscodeSettingsFile} found`)
    }

    // remove config files
    [...C.jsFiles, ...C.jsonFiles].forEach((file: string) => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file)
        consola.success(`Removed ${file}`)
      }
    })
  },
})
