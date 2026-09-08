const test = require("node:test");
const assert = require("node:assert/strict");

const reactCompiler = require("../index.js");

const WRAPPED_COMPONENT = Buffer.from(`
import * as React from "react";

export const Button = React.forwardRef((props, ref) => (
    <button ref={ref} {...props} />
));
`);

const MEMBER_HOOK = Buffer.from(`
import * as React from "react";

export function useCounter() {
    return React.useState(0);
}
`);

test("required check conservatively detects wrapped components", () => {
    assert.equal(
        reactCompiler.isReactCompilerRequiredSync(WRAPPED_COMPONENT),
        true,
    );
});

test("required check conservatively detects member hooks", async () => {
    assert.equal(await reactCompiler.isReactCompilerRequired(MEMBER_HOOK), true);
});

test("required check skips plain modules", () => {
    assert.equal(
        reactCompiler.isReactCompilerRequiredSync(
            Buffer.from("export const answer = 42;"),
        ),
        false,
    );
});

test("required check conservatively handles parse failures", () => {
    assert.equal(
        reactCompiler.isReactCompilerRequiredSync(
            Buffer.from("const value = <number>0;"),
        ),
        true,
    );
});
