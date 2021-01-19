import { createConfig } from './create-rollup-config';

// eslint-disable-next-line no-console
createConfig().catch((err: Error) => console.error(err));
