import fs from 'fs';
import path from 'path';

// import { keccak256 } from 'ethereumjs-util';

import { shuffle } from './shuffle';

const _metadata = JSON.parse(fs.readFileSync(path.join(__dirname, './data/metadata.json'), 'utf8'));

export const metadata = shuffle(_metadata, process.env.SHUFFLE_SEED);

export default metadata;
