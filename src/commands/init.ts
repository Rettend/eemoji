import * as fs from 'node:fs'
import * as path from 'node:path'
import { defineCommand } from 'citty'
import { consola } from 'consola'
import { name } from '../../package.json'
import type { ConfigType, JsFiles, JsonFiles } from '../config'
import { ConfigObject, configTypes } from '../config'

const C = new ConfigObject()

export default defineCommand({
  meta: {
    name: 'init',
    description: 'Initialize eemoji in current git repository',
  },
  args: {
    config: {
      type: 'string',
      description: 'TS or JSON config type or None',
      alias: 'c',
    },
  },
  async run(ctx) {
    console.time('init')
    await checkGitHook(!ctx.args.config) // if config is not specified, perform a clean init
    const configType = (ctx.args.config ? ctx.args.config : 'none') as ConfigType

    if (configType !== 'none') {
      const options = {
        label: {
          ts: 'TypeScript',
          json: 'JSON',
          none: 'None',
        },
        hint: {
          ts: 'for Node.js projects',
          json: 'when installed globally for any project',
          none: 'don\'t create a config file, use the default',
        },
      }

      const selectedConfigType = configTypes.includes(configType)
        ? configType
        : await consola.prompt('Which config would you like to use?', {
          type: 'select',
          options: configTypes.map(type => ({
            value: type,
            label: options.label[type],
            hint: options.hint[type],
          })),
        })

      if (selectedConfigType === 'json') {
        if (await consola.prompt('Add JSON schema for types? (VSCode only)', {
          type: 'confirm',
          initial: true,
        }))
          checkJsonSchema()

        createConfigFile(C.jsonFiles[0], JSON.stringify(C.defaultConfig, null, 2))
      }
      else if (selectedConfigType === 'ts') {
        createConfigFile(C.jsFiles[0], C.defaultTsConfig)
      }
    }

    consola.success('Initialized eemoji!')
    console.timeEnd('init')
  },
})

function createConfigFile(filename: JsonFiles | JsFiles, content: string): void {
  const filePath = path.join(C.cwd, filename)
  fs.writeFileSync(filePath, `${content}\n`)
}

async function checkGitHook(clean: boolean | undefined) {
  if (!fs.existsSync(C.hooksDir)) {
    fs.mkdirSync(C.hooksDir)
    consola.success('Created: .git/hooks')
  }

  if (clean) {
    createHookFile()
  }
  else {
    if (!fs.existsSync(C.hookFile))
      createHookFile()
  }
}

function createHookFile() {
  fs.copyFileSync(C.entryFile, C.hookFile)
  fs.chmodSync(C.hookFile, '755')
  consola.success(`Created: ${C.hookFile}`)
}

function checkJsonSchema() {
  try {
    const content = JSON.parse(fs.readFileSync(C.vscodeSettingsFile, 'utf-8'))

    // Check if 'json.schemas' property exists, if not, initialize it
    if (!content['json.schemas'])
      content['json.schemas'] = []

    // Check if the schema is already present, if not, add it
    if (!content['json.schemas'].some(
      (schema: typeof C.vscodeSettings['json.schemas'][0]) => schema.url?.includes(name),
    )) {
      content['json.schemas'].push(C.vscodeSettings['json.schemas'][0])
      fs.writeFileSync(C.vscodeSettingsFile, JSON.stringify(content, null, 2))
    }
  }
  catch (err: any) {
    if (err.code === 'ENOENT' || err.message.includes('Unexpected end of JSON input')) {
      if (!fs.existsSync('.vscode'))
        fs.mkdirSync('.vscode')
      fs.writeFileSync(C.vscodeSettingsFile, JSON.stringify(C.vscodeSettings, null, 2))
    }
    else {
      consola.error(err)
    }
  }
}
