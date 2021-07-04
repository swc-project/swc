import swc from "../..";
import Visitor from "../../Visitor";
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
const rootDir = './ecmascript/parser/tests/test262-parser/pass-explicit';

const files = (await toArray(walk(rootDir))).filter(t => t.includes('/a'));
console.log(`Files: ${files.length}`)

console.log(Visitor);
class BaseVisitor extends Visitor.default { }

test.each(files)('test(%s)', async (file, done) => {
    if (!file.endsWith('.js')) {
        console.log(`Ignoring ${file}`)
        return
    }

    console.log(`Validating $${file}`)
    const ast = await swc.transformFile(file, {
        syntax: 'ecmascript',
        isModule: file.includes('module.'),
        plugin: [new BaseVisitor()]
    });
    const filename = path.basename(file);

    const { code } = await swc.print(ast);

    const expected = await fs.promises.readFile(`./ecmascript/codegen/tests/references/${filename}`, { encoding: 'utf8' });

    expect(code.trim()).toEqual(expected.trim());

    done()
})
