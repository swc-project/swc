import swc from "..";
import Visitor from "../Visitor";

function assertAllObjectHasTypeFiled(obj, desc = '') {
    if (Array.isArray(obj)) {
        for (const item of obj) {
            assertAllObjectHasTypeFiled(item, `${desc} -> array`);
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

        if ("params" in obj && "span" in obj && "body" in obj) {
            return;
        }

        if (!obj.type) {
            throw new Error(`${desc}: ${JSON.stringify(obj)} should have field 'type'`)
        }

        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                assertAllObjectHasTypeFiled(obj[key], `${desc} -> ${key}`)
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

    visitClassMethod(n) {
        assertAllObjectHasTypeFiled(n, 'BEFORE');
        const e = super.visitClassMethod(n);
        assertAllObjectHasTypeFiled(e);
        return e;
    }
}

const testCodes = [
    {
        input: `const arr = [1, 2, 3]`,
        output: `const arr = [1, 2, 3];`
    },
    {
        input: `export default {
            foo: 'foo',
          } as const;`,
        output: `export default {
            foo: 'foo'
          };`
    },

    {
        input: `const obj = { a: 1, b: 2 };
        const { a, b } = obj;`,
        output: `const obj = { a: 1, b: 2 };
        const { a, b } = obj;`
    }
];
test.each(testCodes)(`code($s)`, async ({ input, output }) => {
    const { code } = await swc.transform(input, {
        jsc: {
            parser: {
                syntax: 'typescript',
            },
            target: 'es2021'
        },
        isModule: true,
        plugin: (ast) => {
            const visitor = new BaseVisitor();
            const after = visitor.visitProgram(ast);
            assertAllObjectHasTypeFiled(after);
            return after
        },
    });

    expect(code.replace(/[\n\t ]/g, '')).toEqual(output.replace(/[\n\t ]/g, ''))
})


// test.each(files)('test262(%s)', async (file) => {
//     if (!file.endsWith('.js')) {
//         console.log(`Ignoring ${file}`)
//         return
//     }

//     console.log(`Validating $${file}`)
//     let astNode;
//     const { code } = await swc.transformFile(file, {
//         jsc: {
//             parser: {
//                 syntax: 'ecmascript',
//             },
//             target: 'es2021'
//         },
//         isModule: file.includes('module.'),
//         plugin: (ast) => {
//             // console.debug(ast);
//             const visitor = new BaseVisitor();
//             const after = visitor.visitProgram(ast);

//             // console.debug(after);
//             assertAllObjectHasTypeFiled(after);
//             astNode = ast;
//             return after
//         },
//     });
//     const filename = path.basename(file);

//     try {
//         await swc.print(astNode);
//     } catch (e) {
//         throw new Error(`${e}: ${JSON.stringify(astNode, null, 4)}`)
//     }

//     const expected = await fs.promises.readFile(`./ecmascript/codegen/tests/references/${filename}`, { encoding: 'utf8' });

//     expect(code.trim()).toEqual(expected.trim());

// })
