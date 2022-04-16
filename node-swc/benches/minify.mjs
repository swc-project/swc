import { minify } from '../../index.js';
import { promises as fs } from 'fs';

const files = process.argv.slice(2);
const inputCode = await fs.readFile(files[0], 'utf8');

await minify(inputCode, {
    compress: true,
    mangle: true,
    sourceMap: false,
})