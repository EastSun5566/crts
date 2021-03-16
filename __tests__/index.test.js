/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-unresolved
const { unlink } = require('fs/promises');

const { createConfigs } = require('../dist/create-configs');

/**
 * @type {{ file: string; dest: string; }[]}
 */
let fileDestList = [];

afterAll(async () => {
  await Promise.all(fileDestList.map(({ dest }) => unlink(dest)));
});

it('should create', async () => {
  fileDestList = await createConfigs({ targetDir: __dirname });

  expect(fileDestList.length).toBe(3);
});
