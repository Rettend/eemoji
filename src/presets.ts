import * as fs from 'node:fs'
import { dirname, join } from 'node:path'
import { ConfigObject, type EmojiConfig } from './config'

const C = new ConfigObject()
type Preset = () => EmojiConfig

function createPresets(pathes: string[]): Preset[] {
  return pathes.map((path) => {
    const config: EmojiConfig = JSON.parse(fs.readFileSync(join(dirname(C.entryDir), 'dist', 'presets', `${path}.json`), 'utf8'))
    return () => ({ ...config })
  })
}

export const [
  presetDefault,
  presetMinimal,
  presetAoc,
] = createPresets([
  'default',
  'minimal',
  'aoc',
]) as [
  Preset,
  Preset,
  Preset,
]
