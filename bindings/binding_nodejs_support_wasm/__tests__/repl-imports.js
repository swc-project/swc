const repl = require("node:repl");
const { PassThrough } = require("node:stream");
const { transformModuleSyntax } = require("../pkg");

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

function execute(source, namespace) {
    return new AsyncFunction(
        "__nodeREPLDynamicImport",
        transformModuleSyntax(source).code
    )(async () => namespace);
}

describe("REPL import bindings", () => {
    it("retains imported bindings across inputs without temporary name collisions", async () => {
        const server = repl.start({
            input: new PassThrough(),
            output: new PassThrough(),
            terminal: false,
            prompt: "",
        });
        const namespace = { default: 7, value: 11, "a-b": 13 };
        server.context.__nodeREPLDynamicImport = async () => namespace;
        const evaluate = (source) =>
            new Promise((resolve, reject) => {
                server.eval(
                    `${transformModuleSyntax(source).code}\n`,
                    server.context,
                    "repl-import-test",
                    (error, value) => (error ? reject(error) : resolve(value))
                );
            });
        try {
            await evaluate('import first from "m";');
            expect(await evaluate("first")).toBe(7);
            await evaluate(
                'import { value as second, "a-b" as third } from "m";'
            );
            expect(await evaluate("[first, second, third]")).toEqual([
                7, 11, 13,
            ]);
            await evaluate('import another, * as ns from "m";');
            expect(await evaluate("[another, ns.value]")).toEqual([7, 11]);
            namespace.value = 17;
            expect(await evaluate("[second, ns.value]")).toEqual([11, 17]);
        } finally {
            server.close();
        }
    });

    it("preserves bare-call this and lexical shadowing", async () => {
        const namespace = {
            call() {
                "use strict";
                return this;
            },
            value: 1,
        };
        // Append the observation after transforming the module: a top-level
        // return is intentionally not valid module input for the transform.
        const code = transformModuleSyntax(
            'import { call, value } from "m";\n' +
                "const observed = [call(), (() => { const value = 2; return value; })(), value];"
        ).code;
        const observed = await new AsyncFunction(
            "__nodeREPLDynamicImport",
            `${code}\nreturn observed;`
        )(async () => namespace);
        expect(observed).toEqual([undefined, 2, 1]);
    });

    it("lets JavaScript enforce const assignment semantics", async () => {
        for (const assignment of [
            "value = 2",
            "value++",
            "({ value } = { value: 2 })",
        ]) {
            await expect(
                execute(`import { value } from "m";\n${assignment};`, {
                    value: 1,
                })
            ).rejects.toThrow("Assignment to constant variable.");
        }
    });

    it("keeps missing-export validation and handles special export names", async () => {
        await expect(execute('import missing from "m";', {})).rejects.toThrow(
            "does not provide an export named 'default'"
        );
        await expect(
            execute('import { missing } from "m";', {})
        ).rejects.toThrow("does not provide an export named 'missing'");
        const code = transformModuleSyntax(
            'import { "a-b" as value, __proto__ as proto } from "m";'
        ).code;
        const result = await new AsyncFunction(
            "__nodeREPLDynamicImport",
            `${code}\nreturn [value, proto];`
        )(async () => ({ "a-b": 1, ["__proto__"]: 2 }));
        expect(result).toEqual([1, 2]);
    });
});
