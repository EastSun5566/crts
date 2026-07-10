/* eslint-disable no-console */
import {
  readdir,
  copyFile,
  mkdir,
  stat,
  // eslint-disable-next-line import/no-unresolved
} from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface CreateConfigsOptions {
  root?: string;
}

async function copyDir(srcDir: string, destDir: string) {
  await mkdir(destDir, { recursive: true });

  const files = await readdir(srcDir);
  return Promise.all(
    // eslint-disable-next-line no-use-before-define
    files.map((file) => copy(
      resolve(srcDir, file),
      resolve(destDir, file),
    )),
  );
}

async function copy(src: string, dest: string) {
  const status = await stat(src);
  if (status.isDirectory()) {
    await copyDir(src, dest);
    return;
  }

  await copyFile(src, dest);
}

export async function createConfigs({
  root = process.cwd(),
}: CreateConfigsOptions = {}): Promise<void> {
  console.log(`✨ Create lib in \`${root}\``);

  await copy(resolve(__dirname, '..', 'template'), root);

  console.log('👌 Done');
  console.log('👉 Run `npm i`');
}

export default createConfigs;
