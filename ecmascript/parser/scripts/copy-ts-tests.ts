#!/usr/bin/env ts-node
import * as fs from 'fs';
import * as path from 'path';
import * as ts from "typescript";
import { promisify } from 'util';

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
        if (17000 <= d.code && d.code < 18000) return false;
        if (2000 <= d.code && d.code < 3000) continue;

        let { line, character } = d.file.getLineAndCharacterOfPosition(d.start!);
        let message = ts.flattenDiagnosticMessageText(d.messageText, "\n");
        console.log(`${d.code} ${d.file.fileName} (${line + 1},${character + 1}): ${message}`);
    }

    return true;
}



async function check(f: string) {
    const res = await doesNotHaveParsingError([f], {
        noEmitOnError: true,
        target: ts.ScriptTarget.Latest,
        module: ts.ModuleKind.None
    });

    const rel = path.relative(root, f);

    if (res) {
        const target = path.join(targetPassDir, rel.replace('.ts', ''))

        console.log('Creating', f, '->', target)
        fs.mkdirSync(target, { recursive: true })

        // We use rename as resumable copy
        if (f.endsWith('.tsx')) {
            fs.renameSync(f, path.join(target, 'input.tsx'))
        } else {
            fs.renameSync(f, path.join(target, 'input.ts'))
        }
        // console.log('Created', target)
    } else {
        const target = path.join(targetErrorDir, rel.replace('.ts', ''))

        console.log('Creating', f, '->', target)
        fs.mkdirSync(target, { recursive: true })

        // We use rename as resumable copy
        if (f.endsWith('.tsx')) {
            fs.renameSync(f, path.join(target, 'input.tsx'))
        } else {
            fs.renameSync(f, path.join(target, 'input.ts'))
        }
        // console.log('Created', target)
    }
}



async function walk(dir: string): Promise<void> {
    const files: string[] = await promisify(fs.readdir)(dir);

    await Promise.all(files.map(async (f) => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            await walk(p)
        } else if (f.endsWith('.ts') || f.endsWith('.tsx')) {
            await check(p)
        }
    }));
}


walk(root)
