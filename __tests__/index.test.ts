import { rm, mkdir, readdir, readFile, writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'child_process';

import { createConfigs } from '../dist/create-configs.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tempParentDir = resolve(__dirname, 'temp-test-runs');

after(async () => {
  await rm(tempParentDir, { recursive: true, force: true });
  console.info(`clean up ${tempParentDir}`);
});

test('should create project in existing directory', async () => {
  const targetDir = resolve(tempParentDir, 'test-existing-dir');
  await mkdir(targetDir, { recursive: true });
  await createConfigs({ root: targetDir });

  const paths = await readdir(targetDir);

  assert.deepEqual(paths.sort(), [
    'package.json',
    'rollup.config.mjs',
    'src',
    'tsconfig.json',
  ]);

  const copiedRollupConfig = await readFile(resolve(targetDir, 'rollup.config.mjs'), 'utf8');
  const templateRollupConfig = await readFile(resolve(__dirname, '..', 'template', 'rollup.config.mjs'), 'utf8');

  assert.equal(copiedRollupConfig, templateRollupConfig);
});

test('should create project in a directory that does not exist', async () => {
  const targetDir = resolve(tempParentDir, 'test-nonexistent-dir');
  // Do NOT pre-create the directory

  await createConfigs({ root: targetDir });

  const paths = await readdir(targetDir);

  assert.deepEqual(paths.sort(), [
    'package.json',
    'rollup.config.mjs',
    'src',
    'tsconfig.json',
  ]);
});

test('should create project using default options (process.cwd())', async () => {
  const testCwd = resolve(tempParentDir, 'test-default-cwd');
  await mkdir(testCwd, { recursive: true });

  const scriptPath = resolve(testCwd, 'run-test.js');
  // Write a script that imports createConfigs and runs it with no arguments.
  // Note: Since __tests__/package.json specifies "type": "module",
  // and we are writing inside a subdirectory, we can use ESM import directly.
  const scriptContent = `
import { createConfigs } from '../../../dist/create-configs.js';
createConfigs().catch(err => {
  console.error(err);
  process.exit(1);
});
`;
  await writeFile(scriptPath, scriptContent, 'utf8');

  // Run the script with cwd set to testCwd
  execSync(`node "${scriptPath}"`, {
    cwd: testCwd,
    stdio: 'pipe',
  });

  // Clean up the script so it's not in the final directory listing
  await rm(scriptPath, { force: true });

  const paths = await readdir(testCwd);
  assert.deepEqual(paths.sort(), [
    'package.json',
    'rollup.config.mjs',
    'src',
    'tsconfig.json',
  ]);
});

test('should create project when directory already exists and contains files', async () => {
  const targetDir = resolve(tempParentDir, 'test-preexisting-files');
  await mkdir(targetDir, { recursive: true });

  // Create a pre-existing file
  const existingFilePath = resolve(targetDir, 'my-existing-file.txt');
  await writeFile(existingFilePath, 'hello existing file', 'utf8');

  await createConfigs({ root: targetDir });

  const paths = await readdir(targetDir);
  assert.deepEqual(paths.sort(), [
    'my-existing-file.txt',
    'package.json',
    'rollup.config.mjs',
    'src',
    'tsconfig.json',
  ]);

  const existingFileContent = await readFile(existingFilePath, 'utf8');
  assert.equal(existingFileContent, 'hello existing file');
});

test('CLI Integration: should create project via CLI command with path argument', async () => {
  const cliPath = resolve(__dirname, '..', 'dist', 'index.js');
  const targetCliDir = resolve(tempParentDir, 'test-cli-arg');

  // Run the CLI with the target directory as the first argument
  execSync(`node "${cliPath}" "${targetCliDir}"`, { stdio: 'pipe' });

  const paths = await readdir(targetCliDir);
  assert.deepEqual(paths.sort(), [
    'package.json',
    'rollup.config.mjs',
    'src',
    'tsconfig.json',
  ]);
});

test('CLI Integration: should create project via CLI command in current directory if no argument is passed', async () => {
  const cliPath = resolve(__dirname, '..', 'dist', 'index.js');
  const targetCliDir = resolve(tempParentDir, 'test-cli-default');
  await mkdir(targetCliDir, { recursive: true });

  // Run CLI in targetCliDir as the working directory, with no arguments
  execSync(`node "${cliPath}"`, {
    cwd: targetCliDir,
    stdio: 'pipe',
  });

  const paths = await readdir(targetCliDir);
  assert.deepEqual(paths.sort(), [
    'package.json',
    'rollup.config.mjs',
    'src',
    'tsconfig.json',
  ]);
});
