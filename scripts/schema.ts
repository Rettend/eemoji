import fs from 'node:fs'
import schema from './../json/eemoji-config-schema.json'
import emojis from './../src/emojis.json'

schema.properties.emojis.default = emojis

fs.writeFileSync('./json/eemoji-config-schema.json', `${JSON.stringify(schema, null, 2)}\n`)
