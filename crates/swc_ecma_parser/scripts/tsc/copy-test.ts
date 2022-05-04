#!/usr/bin/env npx ts-node

// Usage: ./scripts/copy-ts-tests.ts  ~/projects/TypeScript

import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

const targetDir = path.resolve(__dirname, "..", "..", "tests", "tsc");

const fileToCheck = process.argv[2];

async function compile(
    fileNames: string[],
    options: ts.CompilerOptions
): Promise<boolean> {
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

        let { line, character } = d.file.getLineAndCharacterOfPosition(
            d.start!
        );
        let message = ts.flattenDiagnosticMessageText(d.messageText, "\n");
        console.log(
            `${d.code} ${d.file.fileName} (${line + 1},${
                character + 1
            }): ${message}`
        );
    }

    return true;
}

async function check(f: string) {
    const ok = await compile([f], {
        noEmitOnError: true,
        target: ts.ScriptTarget.Latest,
        module: ts.ModuleKind.None,
    });

    if (ok) {
        const filename = path.basename(f);
        const target = path.join(targetDir, filename);

        console.log("Creating", f, "->", target);

        // We use rename as resumable copy
        fs.renameSync(f, target);
        // console.log('Created', target)
    }
}

check(fileToCheck);
