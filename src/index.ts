#!/usr/bin/env node

import { createConfigs } from './create-configs';

// eslint-disable-next-line no-console
createConfigs().catch(console.error);
