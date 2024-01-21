const process = require('node:process')
const fs = require('node:fs')
const exec = require('node:child_process').exec

console.log('UPLOAD_SCHEMA=', process.env.UPLOAD_SCHEMA)
console.log('SKIP_POSTINSTALL=', process.env.SKIP_POSTINSTALL)

if (process.env.UPLOAD_SCHEMA) {
  const schema = require('./../json/eemoji-config-schema.json')
  const emojis = require('./../src/emojis.json')

  schema.properties.emojis.default = emojis

  fs.writeFileSync('./json/eemoji-config-schema.json', `${JSON.stringify(schema, null, 2)}\n`)
}
else if (!process.env.SKIP_POSTINSTALL) {
  exec('node ./bin/eemoji.mjs init -c none', (err, stdout) => {
    if (err)
      console.error(err)
    else
      console.log(stdout)
  })
}
