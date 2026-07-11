import { createRequire } from 'node:module';
import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const {
  main,
  module,
  browser,
  name,
} = pkg;

const camelize = (value) => value
  .toLowerCase()
  .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: main,
      format: 'cjs',
      exports: 'named',
    },
    {
      file: module,
      format: 'es',
    },
    {
      name: camelize(name),
      file: browser,
      format: 'umd',
      exports: 'named',
    },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({ exclude: ['rollup.config.mjs'] }),
    terser(),
    filesize(),
  ],
});
