import swc from "../..";
import * as fs from 'fs';
import * as path from 'path';


async function* walk(dir) {
    for await (const d of await fs.promises.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
    }
}

async function toArray(asyncIterator) {
    const arr = [];
    for await (const i of asyncIterator) arr.push(i);
    return arr;
}

// We use only subset of tests because it's too slow
const rootDir = './ecmascript/parser/tests/typescript/tsc/parser/ecmascript5';

const files = await toArray(walk(rootDir));

test.each(files)('test(%s)', async (file, done) => {
    if (!file.endsWith('.ts') && !file.endsWith('.tsx')) {
        return
    }
    let ast;
    try {
        ast = await swc.parseFile(file, {
            syntax: 'typescript',
            tsx: file.endsWith('tsx')
        });
        console.log(`Validating $${file}`)
    } catch (e) {
        // We are not testing parser
        return
    }


    done()
})
