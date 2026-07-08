import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';
import pkg from './package.json' with { type: 'json' };

const {
  main,
  module,
  browser,
  name,
} = pkg;

const camelize = (string) => string
  .toLowerCase()
  .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());

export default {
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
    typescript(),
    terser(),
    filesize(),
  ],
};
