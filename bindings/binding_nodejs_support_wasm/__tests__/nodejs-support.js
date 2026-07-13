const fs = require("node:fs");
const path = require("node:path");
const nodejsSupport = require("../pkg");

function validatedImport(specifier, exports) {
    let out = `__nodeREPLDynamicImport(${JSON.stringify(specifier)})`;

    if (exports.length > 0) {
        out += `.then((m) => { `;
        for (const exportName of exports) {
            const message = `The requested module '${specifier}' does not provide an export named '${exportName}'`;
            out += `if (!(${JSON.stringify(
                exportName
            )} in m)) throw new SyntaxError(${JSON.stringify(message)}); `;
        }
        out += `return m; })`;
    }

    return out;
}

describe("@swc/nodejs-support-wasm", () => {
    it("exposes the TypeScript transform and Node.js helpers at the top level", () => {
        expect(typeof nodejsSupport.transform).toBe("function");
        expect(typeof nodejsSupport.transformSync).toBe("function");
        expect(typeof nodejsSupport.transformModuleSyntax).toBe("function");
        expect(typeof nodejsSupport.getFirstExpression).toBe("function");
        expect(typeof nodejsSupport.isValidSyntax).toBe("function");
        expect(typeof nodejsSupport.isRecoverableError).toBe("function");
        expect(nodejsSupport.nodejs).toBeUndefined();
        expect(nodejsSupport.__nodejsTransformModuleSyntax).toBeUndefined();
    });

    it("preserves the existing TypeScript transform behavior", async () => {
        const source = "export const value: number = 1;";
        const expected = {
            code: "export const value         = 1;",
            map: undefined,
        };

        expect(nodejsSupport.transformSync(source, {})).toEqual(expected);
        await expect(nodejsSupport.transform(source, {})).resolves.toEqual(
            expected
        );

        const bytes = new TextEncoder().encode(source);
        expect(nodejsSupport.transformSync(bytes, {})).toEqual(expected);
        await expect(nodejsSupport.transform(bytes, {})).resolves.toEqual(
            expected
        );
    });

    it("preserves TypeScript transform errors", async () => {
        expect(() => nodejsSupport.transformSync("enum Foo {}", {})).toThrow();
        await expect(
            nodejsSupport.transform("enum Foo {}", {})
        ).rejects.toBeDefined();
    });

    it("transforms module syntax without exposing an AST", () => {
        expect(
            nodejsSupport.transformModuleSyntax(`import fs from "node:fs";`)
        ).toEqual({
            code: `const __nodeREPLImport0 = await ${validatedImport(
                "node:fs",
                ["default"]
            )};`,
            hadModuleSyntax: true,
        });

        expect(
            nodejsSupport.transformModuleSyntax(
                `import { readFile as rf } from "node:fs";\nrf();`
            )
        ).toEqual({
            code: `const __nodeREPLImport0 = await ${validatedImport(
                "node:fs",
                ["readFile"]
            )};\n__nodeREPLImport0.readFile();`,
            hadModuleSyntax: true,
        });

        expect(
            nodejsSupport.transformModuleSyntax(`console.log(import.meta.url);`)
        ).toEqual({
            code: `console.log((() => { throw new SyntaxError("Cannot use import.meta outside a module"); })().url);`,
            hadModuleSyntax: true,
        });

        expect(
            nodejsSupport.transformModuleSyntax(`const importName = "import";`)
        ).toEqual({
            code: `const importName = "import";`,
            hadModuleSyntax: false,
        });
    });

    it("supports Uint8Array input", () => {
        const input = new TextEncoder().encode(`import "node:fs";`);

        expect(nodejsSupport.transformModuleSyntax(input)).toEqual({
            code: `await __nodeREPLDynamicImport("node:fs");`,
            hadModuleSyntax: true,
        });
    });

    it("extracts the first expression for assertion locations", () => {
        expect(nodejsSupport.getFirstExpression("assert.ok(value)", 9)).toBe(
            "assert.ok(value)"
        );
        expect(nodejsSupport.getFirstExpression("assert(value)", 6)).toBe(
            "assert(value)"
        );
        expect(
            nodejsSupport.getFirstExpression("a(); assert.ok(value); b()", 13)
        ).toBe("assert.ok(value)");
        expect(
            nodejsSupport.getFirstExpression(
                "assert[method + suffix](value)",
                23
            )
        ).toBe("assert[method + suffix](value)");
    });

    it("checks syntax validity and recoverability", () => {
        expect(nodejsSupport.isValidSyntax("await value")).toBe(true);
        expect(nodejsSupport.isValidSyntax("const x: number = 1")).toBe(true);
        expect(nodejsSupport.isValidSyntax("function foo(")).toBe(false);
        expect(nodejsSupport.isRecoverableError("function foo() {")).toBe(true);
        expect(nodejsSupport.isRecoverableError("{ value: 1 }")).toBe(false);
        expect(nodejsSupport.isRecoverableError("{}")).toBe(false);
        expect(nodejsSupport.isRecoverableError("const x: number = 1")).toBe(
            false
        );
        expect(nodejsSupport.isRecoverableError("2e")).toBe(false);
    });

    it("generates package metadata and top-level TypeScript declarations", () => {
        const packageDir = path.join(__dirname, "../pkg");
        const packageJson = JSON.parse(
            fs.readFileSync(path.join(packageDir, "package.json"), "utf8")
        );
        const types = fs.readFileSync(
            path.join(packageDir, "wasm.d.ts"),
            "utf8"
        );

        expect(packageJson.name).toBe("@swc/nodejs-support-wasm");
        expect(packageJson.description).toBe(
            "SWC WebAssembly helpers for Node.js"
        );
        expect(packageJson.files).not.toContain("wasm_bg.wasm");
        expect(fs.existsSync(path.join(packageDir, "wasm_bg.wasm"))).toBe(
            false
        );
        expect(types).toContain(
            "export declare function transformModuleSyntax"
        );
        expect(types).toContain("export interface ModuleSyntaxTransformOutput");
        expect(types).not.toContain("namespace nodejs");
        expect(types).not.toContain("__nodejsTransformModuleSyntax");
    });
});
