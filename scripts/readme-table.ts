import fs from 'node:fs'
import process from 'node:process'
import path from 'node:path'
import type {
  CommentArray,
  CommentDescriptor,
  CommentJSONValue,
  CommentSymbol,
} from 'comment-json'
import { parse } from 'comment-json'
import { markdownTable } from 'markdown-table'
import emojis from '../src/emojis.json'

const cwd = process.env.INIT_CWD || process.cwd()
const eemojiPath = path.join(cwd, 'src/emojis.jsonc')
const readmePath = path.join(cwd, 'README.md')

const emojiFile = fs.readFileSync(eemojiPath, 'utf8')
const emojiJsonc = parse(emojiFile)

if (!emojiJsonc) {
  console.error('Failed to parse emojis.jsonc')
  process.exit(1)
}

const table = [['Type', 'Subtype', 'Emoji', 'Description']]

for (const key in emojis) {
  if (typeof emojis[key] === 'object') {
    for (const subKey in emojis[key]) {
      const description = getDescription(emojiJsonc[key], subKey)
      table.push([`\`${key}\``, `\`${subKey}\``, emojis[key][subKey], description])
    }
  }
  else {
    const description = getDescription(emojiJsonc, key)
    table.push([`\`${key}\``, '', emojis[key], description])
  }
}

function getDescription(object: CommentJSONValue, key: string) {
  if (!object)
    return ''

  const commentArray = object as CommentArray<string>
  const symbolName: CommentDescriptor = `after:${key}`

  const comment = commentArray[Symbol.for(symbolName) as CommentSymbol]
  return comment ? comment[0].value : ''
}

const markdown = markdownTable(table)

let readmeContent = fs.readFileSync(readmePath, 'utf8')
readmeContent = readmeContent.replace(
  /<!-- emoji table start -->[\s\S]*<!-- emoji table end -->/,
  `<!-- emoji table start -->\n${markdown}\n<!-- emoji table end -->`,
)
fs.writeFileSync(readmePath, readmeContent)
