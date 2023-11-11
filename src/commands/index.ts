import type { CommandDef } from 'citty'

const _rDefault = (r: any) => (r.default || r) as Promise<CommandDef>

export const commands = {
  init: () => import('./init').then(_rDefault),
  run: () => import('./run').then(_rDefault),
  cleanup: () => import('./cleanup').then(_rDefault),
} as const
