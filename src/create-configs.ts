/* eslint-disable no-console */
import {
  readdir,
  copyFile,
  mkdir,
  stat,
  // eslint-disable-next-line import/no-unresolved
} from 'fs/promises';
import { resolve } from 'path';

interface CreateConfigsOptions {
  root?: string;
}

async function copyDir(srcDir: string, destDir: string) {
  await mkdir(destDir, { recursive: true });

  const files = await readdir(srcDir);
  await Promise.all([
    // eslint-disable-next-line no-use-before-define
    files.map((file) => copy(
      resolve(srcDir, file),
      resolve(destDir, file),
    )),
  ]);
}

async function copy(src: string, dest: string) {
  const { isDirectory } = await stat(src);
  if (isDirectory()) {
    copyDir(src, dest);
    return;
  }

  copyFile(src, dest);
}

export async function createConfigs({
  root = process.cwd(),
}: CreateConfigsOptions = {}): Promise<void> {
  console.log(`✨ Create configs in \`${root}\``);

  await copy(resolve(__dirname, 'template'), root);

  console.log('👌 Done');
  console.log('👉 Run `npm i`');
}

export default createConfigs;
