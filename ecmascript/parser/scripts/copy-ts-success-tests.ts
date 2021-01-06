// Usage:  npx tsc *.ts && node copy-ts-tests.js  ~/projects/TypeScript

import * as ts from "typescript";
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const targetDir = path.resolve(__dirname, '..', 'tests', 'typescript', 'tsc')

const root = path.join(process.argv[2], 'tests', 'cases', 'conformance')
process.chdir(root)



async function compile(fileNames: string[], options: ts.CompilerOptions): Promise<boolean> {
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
        if (10000 <= d.code) return false;
        if (2000 <= d.code && d.code < 3000) continue;

        let { line, character } = d.file.getLineAndCharacterOfPosition(d.start!);
        let message = ts.flattenDiagnosticMessageText(d.messageText, "\n");
        console.log(`${d.code} ${d.file.fileName} (${line + 1},${character + 1}): ${message}`);
    }

    return true;
}



async function check(f: string) {
    const ok = await compile([f], {
        noEmitOnError: true,
        target: ts.ScriptTarget.Latest,
        module: ts.ModuleKind.None
    });

    if (ok) {
        const rel = path.relative(root, f);
        const target = path.join(targetDir, rel.replace('.ts', ''))

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
