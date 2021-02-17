import * as fs from 'fs';
import * as path from 'path';

async function* walk(dir: string): AsyncGenerator<string> {
    for await (const d of await fs.promises.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
    }
}

// Then, use it with a simple async for loop
async function main() {
    // TODO: Generalize path
    for await (const p of walk('src/jsx/fixture')) {
        if (!p.endsWith('.json')) {
            continue
        }
        console.log(p)
    }
}

main()