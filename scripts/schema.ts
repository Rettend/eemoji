import fs from 'node:fs'
import * as jsonc from 'jsonc-parser'
import schema from './../json/eemoji-config-schema.json'

const emojis = jsonc.parse(fs.readFileSync('./src/presets/default.jsonc', 'utf8'))

schema.properties.emojis.default = emojis
fs.writeFileSync('./json/eemoji-config-schema.json', `${JSON.stringify(schema, null, 2)}\n`)

fs.writeFileSync('./src/presets/default.json', `${JSON.stringify(emojis, null, 2)}\n`)
