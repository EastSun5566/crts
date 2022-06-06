import {
  rm,
  mkdir,
  readdir,
} from 'fs/promises';
import { resolve } from 'path';

import { createConfigs } from '../src/create-configs';

const targetDir = resolve(__dirname, 'my-lib');

afterAll(async () => {
  await rm(targetDir, { recursive: true });

  console.info(`clean up ${targetDir}`);
});

it('should create project', async () => {
  await mkdir(targetDir);
  await createConfigs({ root: targetDir });

  const paths = await readdir(targetDir);

  expect(paths.length).toBe(0);
});
