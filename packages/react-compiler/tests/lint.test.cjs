const test = require("node:test");
const assert = require("node:assert/strict");

const reactCompiler = require("../index.js");

const REF_ACCESS_SOURCE = `
import { useRef } from 'react';

function App() {
    const ref = useRef(1);
    return ref.current;
}
`;

test("lintSync reports a rule violation with rule metadata", () => {
    const diagnostics = reactCompiler.lintSync(Buffer.from(REF_ACCESS_SOURCE));

    assert.equal(diagnostics.length, 1);
    assert.equal(diagnostics[0].severity, "error");
    assert.equal(diagnostics[0].ruleId, "refs");
    assert.equal(diagnostics[0].category, "Refs");
});

test("lintSync returns no diagnostics for non-React code", () => {
    const diagnostics = reactCompiler.lintSync(Buffer.from("const x = 1;"));

    assert.deepEqual(diagnostics, []);
});

test("lint (async) matches lintSync", async () => {
    const syncResult = reactCompiler.lintSync(Buffer.from(REF_ACCESS_SOURCE));
    const asyncResult = await reactCompiler.lint(Buffer.from(REF_ACCESS_SOURCE));

    assert.deepEqual(asyncResult, syncResult);
});
