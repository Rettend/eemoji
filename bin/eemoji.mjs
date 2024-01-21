#!/usr/bin/env node

import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import { runMain } from './../dist/index.mjs'

globalThis.__eemoji_pkg__ = {
  entryDir: dirname(fileURLToPath(import.meta.url)),
}

runMain()
