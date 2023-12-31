import { runMain as _runMain } from 'citty'
import { main } from './main'

export { defineConfig, type Config } from './config'

export const runMain = () => _runMain(main)
