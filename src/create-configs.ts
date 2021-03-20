/* eslint-disable no-console */
import { createReadStream, createWriteStream } from 'fs';
// eslint-disable-next-line import/no-unresolved
import { readdir } from 'fs/promises';
import { resolve } from 'path';

interface CreateConfigsOptions {
  targetDir?: string;
}

interface FileDest {
  file: string;
  dest: string;
}

interface RWOptions {
  src: string;
  dest: string;
}

const readWriteFile = ({
  src,
  dest,
}: RWOptions) => new Promise((res, rej) => {
  createReadStream(src)
    .pipe(createWriteStream(dest))
    .on('end', res)
    .on('error', rej);
});

export async function createConfigs({
  targetDir = process.cwd(),
}: CreateConfigsOptions = {}): Promise<FileDest[]> {
  console.log(`🔧 Create configs in \`${targetDir}\``);

  const targetFiles = await readdir(resolve(__dirname, 'template'));
  await Promise.all([
    targetFiles.map((file) => readWriteFile({
      src: resolve(__dirname, 'template', file),
      dest: resolve(targetDir, file),
    })),
  ]);

  console.log('✨ Done');
  console.log('👉 Run `npm i`');

  return targetFiles.map((file) => ({ file, dest: resolve(targetDir, file) }));
}

export default createConfigs;
