// const { unlink } = require('fs/promises');
const { createConfig } = require('../dist/create-rollup-config');

it('should works', async () => {
  const fileDestList = await createConfig({ targetDir: __dirname });

  console.log({ fileDestList });

  expect(fileDestList).toBeTruthy();
});
