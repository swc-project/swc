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
    for await (const f of walk('src/jsx/fixture')) {
        if (!f.endsWith('.json')) {
            continue
        }
        const obj = JSON.parse(await fs.promises.readFile(f, { encoding: 'utf-8' }));
        const dir = path.dirname(f);

        if (obj.throws) {
            await fs.promises.writeFile(path.join(dir, "output.stderr"), obj.throws);
        }


        console.log(f);
        if (obj.plugins) {
            for (const [plugin, config] of obj.plugins) {
                if (plugin === 'transform-react-jsx') {
                    console.log(plugin, config);
                    await fs.promises.writeFile(f, JSON.stringify({
                        ...obj,
                        ...config,
                    }), { encoding: 'utf-8' });
                    break
                }
            }
        }

    }
}

main()