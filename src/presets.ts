import * as fs from 'node:fs'
import * as jsonc from 'jsonc-parser'
import type { EmojiConfig } from './config'
import { r } from './utils/utils'

type Preset = () => EmojiConfig
type PathLiteral = `${string}.jsonc`

function createPresets(pathes: PathLiteral[]) {
  return pathes.map((path) => {
    const config: EmojiConfig = jsonc.parse(fs.readFileSync(r(`src/presets/${path}`), 'utf-8'))
    return () => ({ ...config })
  })
}

export const [
  presetDefault,
  presetMinimal,
  presetAoc,
] = createPresets([
  'default.jsonc',
  'minimal.jsonc',
  'aoc.jsonc',
]) as [
  Preset,
  Preset,
  Preset,
]
