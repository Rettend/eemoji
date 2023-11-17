#!/usr/bin/env node

import { process } from 'node:process'
import { runMain } from '../src/index'

if (!process.env.SKIP_POSTINSTALL)
  runMain()
