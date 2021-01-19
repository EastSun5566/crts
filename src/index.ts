import fs from 'fs';
import path from 'path';

async function main() {
  const cwd = process.cwd();
  console.log(`Create rollup config in ${cwd}`);

  const configFile = 'rollup.config.js';
  const pkgFile = 'package.json';

  const configBuffer = fs.readFileSync(path.join(__dirname, 'template', configFile));
  const pkg = await import(path.join(__dirname, 'template', pkgFile));
  pkg.name = path.basename(cwd);

  fs.writeFileSync(cwd, configBuffer);
  fs.writeFileSync(cwd, JSON.stringify(pkg, null, 2));

  console.log('Done. Run `npm i`');
  console.log();
}

main().catch((err) => console.error(err));
