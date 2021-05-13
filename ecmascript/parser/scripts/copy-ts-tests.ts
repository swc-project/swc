#!/usr/bin/env ts-node
import * as fs from 'fs';
import * as path from 'path';
import * as ts from "typescript";

// Usage: ./scripts/copy-ts-tests.js  ~/projects/TypeScript

const targetPassDir = path.resolve(__dirname, '..', 'tests', 'typescript', 'tsc')
const targetErrorDir = path.resolve(__dirname, '..', 'tests', 'typescript-errors', 'tsc')

const root = path.join(process.argv[2], 'tests', 'cases', 'conformance')
process.chdir(root)


async function doesNotHaveParsingError(fileNames: string[], options: ts.CompilerOptions): Promise<boolean> {
    options.noEmit = true;
    options.jsx = ts.JsxEmit.Preserve;
    let program = ts.createProgram(fileNames, options);
    let emitResult = program.emit();

    let allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);

    for (const d of allDiagnostics) {
        if (!d.file) continue;
        // Parse failure
        if (1000 <= d.code && d.code < 2000) return false;
        if (
            d.code === 18016 ||
            d.code === 18024 ||
            d.code === 18029 ||
            d.code === 18009 ||
            d.code === 18006 ||
            d.code === 2657
        ) return false;
        if (17000 <= d.code && d.code < 18000) return false;
        if (2000 <= d.code && d.code < 3000) continue;

        let { line, character } = d.file.getLineAndCharacterOfPosition(d.start!);
        let message = ts.flattenDiagnosticMessageText(d.messageText, "\n");
        console.log(`${d.code} ${d.file.fileName} (${line + 1},${character + 1}): ${message}`);
    }

    return true;
}



// We use rename as resumable copy
async function check(f: string) {
    const testName = path.relative(root, f).replace('.tsx', '').replace('.ts', '');
    const passTestDir = path.join(targetPassDir, testName)
    const errorTestDir = path.join(targetErrorDir, testName)
    const passTestFile = f.endsWith('.tsx') ? path.join(passTestDir, 'input.tsx') : path.join(passTestDir, 'input.ts');
    const errorTestFile = f.endsWith('.tsx') ? path.join(errorTestDir, 'input.tsx') : path.join(errorTestDir, 'input.ts');

    try {
        if ((await fs.promises.stat(passTestFile)).isFile()) {
            console.log(`${passTestFile} exists`)
            return
        }
    } catch (ignored) {
    }

    try {
        if ((await fs.promises.stat(errorTestFile)).isFile()) {
            console.log(`${passTestFile} exists`)
            return
        }
    } catch (ignored) {
    }


    const res = await doesNotHaveParsingError([f], {
        noEmitOnError: true,
        target: ts.ScriptTarget.Latest,
        module: ts.ModuleKind.None
    });

    console.log(`Moving ${testName} at ${f}`)


    if (res) {
        await fs.promises.mkdir(passTestDir, { recursive: true })
        await fs.promises.rename(f, passTestFile);
        console.log('Moved', f, '->', passTestFile)
    } else {
        await fs.promises.mkdir(errorTestDir, { recursive: true })
        await fs.promises.rename(f, errorTestFile);
        console.log('Moved', f, '->', errorTestFile)
    }
}



async function walk(dir: string): Promise<void> {
    const files: string[] = await fs.promises.readdir(dir);

    await Promise.all(files.map(async (f) => {
        const p = path.join(dir, f);
        if ((await fs.promises.stat(p)).isDirectory()) {
            await walk(p)
        } else if (f.endsWith('.ts') || f.endsWith('.tsx')) {
            await check(p)
        }
    }));
}


walk(root)
