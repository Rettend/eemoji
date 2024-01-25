import fs from 'node:fs'
import path from 'node:path'
import * as jsonc from 'jsonc-parser'
import { r } from '../src/utils/utils'

const presetsDir = r('src/presets')
const outputDir = r('dist/presets')

if (!fs.existsSync(outputDir))
  fs.mkdirSync(outputDir, { recursive: true })

fs.readdir(presetsDir, (err, files) => {
  if (err)
    throw err

  files.forEach((file) => {
    if (path.extname(file) === '.jsonc') {
      fs.readFile(path.join(presetsDir, file), 'utf8', (err, data) => {
        if (err)
          throw err

        const json = jsonc.parse(data)
        const outputFilename = path.join(outputDir, `${path.basename(file, '.jsonc')}.json`)

        fs.writeFile(outputFilename, JSON.stringify(json, null, 2), (err) => {
          if (err)
            throw err
        })
      })
    }
  })
})
