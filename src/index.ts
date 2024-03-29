import { runMain as _runMain } from 'citty'
import { main } from './main'

export * from './presets'
export { defineConfig, defineDefaultConfig, type Config } from './config'

export const runMain = () => _runMain(main)
