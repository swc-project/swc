import { compile } from '@mdx-js/mdx'
import * as path from 'path';
import { promises as fs } from 'fs';

const rootDir = process.argv[2];



async function* walk(dir) {
    for await (const d of await fs.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
    }
}

async function main() {
    for await (const p of walk(rootDir)) {
        if (!p.endsWith('.mdx')) {
            continue
        }
        const file = p;
        const inputContent = await fs.readFile(file, 'utf8');
        const testDir = path.dirname(file);
        const outputPath = path.join(testDir, 'output.js');

        console.log(`Processing ${file}`)
        console.log(`${inputContent}`)
        const output = await compile({ path: file, value: inputContent }, { jsx: true })


        await fs.writeFile(outputPath, output.value)
    }
}


await main();