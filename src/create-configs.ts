/* eslint-disable no-console */
import { createReadStream, createWriteStream } from 'fs';
// eslint-disable-next-line import/no-unresolved
import { readdir } from 'fs/promises';
import { join } from 'path';

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
}: RWOptions) => new Promise((resolve, reject) => {
  createReadStream(src)
    .pipe(createWriteStream(dest))
    .on('end', resolve)
    .on('error', reject);
});

export async function createConfigs({
  targetDir = process.cwd(),
}: CreateConfigsOptions = {}): Promise<FileDest[]> {
  console.log(`🔧 Create configs in ${targetDir}`);

  const targetFiles = await readdir('template');
  await Promise.all([
    targetFiles.map((file) => readWriteFile({
      src: join('template', file),
      dest: join(targetDir, file),
    })),
  ]);

  console.log('✨ Done');
  console.log('👉 Run `npm i`');

  return targetFiles.map((file) => ({ file, dest: join(targetDir, file) }));
}

export default createConfigs;
