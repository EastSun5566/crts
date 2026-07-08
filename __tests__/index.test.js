const {
  rm,
  mkdir,
  readdir,
} = require('fs/promises');
const { resolve } = require('path');
const { after, test } = require('node:test');
const assert = require('node:assert/strict');

const { createConfigs } = require('../dist/create-configs');

const targetDir = resolve(__dirname, 'my-lib');

after(async () => {
  await rm(targetDir, { recursive: true, force: true });

  console.info(`clean up ${targetDir}`);
});

test('should create project', async () => {
  await rm(targetDir, { recursive: true, force: true });
  await mkdir(targetDir);
  await createConfigs({ root: targetDir });

  const paths = await readdir(targetDir);

  assert.deepEqual(paths.sort(), [
    'package.json',
    'rollup.config.mjs',
    'src',
    'tsconfig.json',
  ]);
});
