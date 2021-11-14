import { compile } from '@mdx-js/mdx'
import * as path from 'path';
import { promises as fs } from 'fs';

const file = process.argv[2];
const inputContent = await fs.readFile(file, 'utf8');
const testDir = path.dirname(file);
const outputPath = path.join(testDir, 'output.js');

console.log(`Processing ${file}`)
console.log(`${inputContent}`)
const output = await compile({ path: file, value: inputContent }, { jsx: true })


await fs.writeFile(outputPath, output.value)