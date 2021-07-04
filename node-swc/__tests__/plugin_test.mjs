const swc = require("../..");
const fs = require("fs");
const path = require("path");


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

const files = await toArray(walk('./ecmascript/parser/tests/typescript/tsc'));

test.each(files)('test(%s)', (file, done) => {
    if (!file.endsWith('.ts') && !file.endsWith('.tsx')) {
        return
    }
    const ast = await swc.parseFile(p);


    done()
})
