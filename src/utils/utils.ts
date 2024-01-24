import * as path from 'node:path'
import * as process from 'node:process'

const cwd = process.env.INIT_CWD || process.cwd()
export const r = (file: string) => path.join(cwd, file)
