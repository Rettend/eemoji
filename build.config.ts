import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    esbuild: {
      minify: true,
    },
  },
  externals: [
    'consola',
    'citty',
    'cosmiconfig',
    'lodash-es',
    'jsonc-parser',
    '@cozy-console/mini',
  ],
})
