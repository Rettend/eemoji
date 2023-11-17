#!/usr/bin/env node

import process from 'node:process'
import { runMain } from './../dist/index.mjs'

if (!process.env.SKIP_POSTINSTALL)
  runMain()
