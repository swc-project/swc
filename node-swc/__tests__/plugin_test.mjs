import swc from "../..";
import Visitor from "../../Visitor";
import * as fs from 'fs';
import * as path from 'path';
import { jest } from '@jest/globals'
jest.setTimeout(5 * 1000)

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

function assertAllObjectHasTypeFiled(obj) {
    if (Array.isArray(obj)) {
        for (const item of obj) {
            assertAllObjectHasTypeFiled(item);
        }
        return
    }

    if (!obj) {
        return
    }

    if (typeof obj === 'object') {
        if (typeof obj.start !== 'undefined' && typeof obj.end !== 'undefined') {
            return;
        }
        if ("spread" in obj) {
            return;
        }

        if (!obj.type) {
            throw new Error(`${JSON.stringify(obj)} should have field 'type'`)
        }

        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                assertAllObjectHasTypeFiled(obj[key])
            }
        }

    }

}

class BaseVisitor extends Visitor.default {
    visitExpression(n) {
        const e = super.visitExpression(n);
        assertAllObjectHasTypeFiled(e);
        return e;
    }

    visitPattern(n) {
        const e = super.visitPattern(n);
        assertAllObjectHasTypeFiled(e);
        return e;
    }

    visitStatement(n) {
        const e = super.visitStatement(n);
        assertAllObjectHasTypeFiled(e);
        return e;
    }

    visitFunctionDeclaration(n) {
        const e = super.visitFunctionDeclaration(n);
        assertAllObjectHasTypeFiled(e);
        return e;
    }

    visitClassMember(n) {
        const e = super.visitClassMember(n);
        assertAllObjectHasTypeFiled(e);
        return e;
    }
}


test.each(files)('test(%s)', async (file) => {
    if (!file.endsWith('.js')) {
        console.log(`Ignoring ${file}`)
        return
    }

    console.log(`Validating $${file}`)
    const ast = await swc.transformFile(file, {
        jsc: {
            parser: {
                syntax: 'ecmascript',
            }
        },
        isModule: file.includes('module.'),
        plugin: (ast) => {
            console.debug(ast);
            const visitor = new BaseVisitor();
            const after = visitor.visitProgram(ast);

            console.debug(after);
            assertAllObjectHasTypeFiled(after);
            return after
        },
    });
    const filename = path.basename(file);

    const { code } = await swc.print(ast);

    const expected = await fs.promises.readFile(`./ecmascript/codegen/tests/references/${filename}`, { encoding: 'utf8' });

    expect(code.trim()).toEqual(expected.trim());

})
