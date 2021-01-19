import { readFile, writeFile } from 'fs/promises';
import { join, basename } from 'path';

export async function createRollupConfig(): Promise<void> {
  const cwd = process.cwd();
  console.log(`Create rollup config in ${cwd}`);

  const configFile = 'rollup.config.js';
  const pkgFile = 'package.json';

  const [configBuffer, pkg]: [Buffer, Record<string, any>] = await Promise.all([
    readFile(join(__dirname, 'template', configFile)),
    import(join(__dirname, 'template', pkgFile)),
  ]);
  pkg.name = basename(cwd);

  await Promise.all([
    writeFile(cwd, configBuffer),
    writeFile(cwd, JSON.stringify(pkg, null, 2)),
  ]);

  console.log('Done. Run `npm i`');
  console.log();
}

export default createRollupConfig;
