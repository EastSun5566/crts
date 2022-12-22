/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'rollup';
import { nodeResolve, DEFAULTS as NODE_RESOLVE_DEFAULTS } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pkg from './package.json' assert { type: 'json' };

const {
  main,
  module,
  browser,
  name,
} = pkg;

const TS_EXTENSIONS = ['.ts', '.tsx'];

const camalize = (string: string) => string
  .toLowerCase()
  .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: main,
      format: 'cjs',
      // sourcemap: true,
      exports: 'named',
    },
    {
      file: module,
      format: 'es',
      // sourcemap: true,
    },
    {
      name: camalize(name),
      file: browser,
      format: 'umd',
      // sourcemap: true,
      exports: 'named',
    },
  ],
  plugins: [
    nodeResolve({ extensions: [...NODE_RESOLVE_DEFAULTS.extensions, ...TS_EXTENSIONS] }),
    commonjs(),
    typescript({ exclude: ['rollup.config.ts'] }),
    terser(),
    filesize(),
  ],
});
