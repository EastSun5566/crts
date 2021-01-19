/* eslint-disable no-console */
import { createReadStream, createWriteStream } from 'fs';
import { join } from 'path';

interface CreateOptions {
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

export async function createConfig({
  targetDir = process.cwd(),
}: CreateOptions = {}): Promise<FileDest[]> {
  console.log(`Create rollup config in ${targetDir}`);

  const targetFiles = [
    'rollup.config.js',
    'tsconfig.json',
    'package.json',
  ];

  await Promise.all([
    targetFiles.map((file) => readWriteFile({
      src: join(__dirname, '..', 'template', file),
      dest: join(targetDir, file),
    })),
  ]);

  console.log('Done.');
  console.log(`cd ${targetDir}`);
  console.log('Run `npm i`');
  console.log();

  return targetFiles.map((file) => ({ file, dest: join(targetDir, file) }));
}

export default createConfig;
