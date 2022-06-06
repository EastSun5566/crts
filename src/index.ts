#!/usr/bin/env node

import { resolve } from 'path';
import { createConfigs } from './create-configs';

// eslint-disable-next-line no-console
createConfigs({
  root: process.argv[2] && resolve(process.cwd(), process.argv[2]),
}).catch(console.error);
