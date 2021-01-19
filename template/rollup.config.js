import { nodeResolve, DEFAULTS } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

import {
  main,
  module,
  browser,
  name,
} from './package.json';

/**
 * @param {string} str
 */
const camalize = (str) => str
  .toLowerCase()
  .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.ts',
  output: [
    { file: main, format: 'cjs', exports: 'named' },
    { file: module, format: 'es' },
    {
      name: camalize(name), file: browser, format: 'umd', exports: 'named',
    },
  ],
  plugins: [
    nodeResolve({ extensions: [...DEFAULTS.extensions, '.ts'] }),
    typescript(),
    terser(),
  ],
};

export default config;
