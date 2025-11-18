import swc from "..";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("Should preserve comments", () => {
    it("Should preserve comments preceding types", async () => {
        const input = `/*comment*/ type X = number; const x: X = 1`;
        const result = swc.transformSync(input, {
            "jsc": {
                "parser": {
                    "syntax": "typescript",
                },
                "preserveAllComments": true
            }
        });
        expect(result.code).toBe('/*comment*/ var x = 1;\n');
    });

    it("Should preserve comments preceding shifted functions", () => {
        const filename = path.resolve(
            __dirname + "/../tests/issue-2964/input1.ts"
        );

        const { code } = swc.transformFileSync(filename);

        expect(code).toContain("/* input 1 comment 1 */ \"use strict\"")
        expect(code).toContain(`// input 1 comment 2\nvar saysHello =`)
    });

    it("Should not share comments between modules", () => {
        const filename1 = path.resolve(
            __dirname + "/../tests/issue-2964/input1.ts"
        );
        const filename2 = path.resolve(
            __dirname + "/../tests/issue-2964/input2.ts"
        );

        swc.transformFileSync(filename1);

        const result2 = swc.transformFileSync(filename2);
        const result1 = swc.transformFileSync(filename1);

        expect(result1.code).toMatch("input 1");
        expect(result1.code).not.toMatch("input 2");

        expect(result2.code).toMatch("input 2");
        expect(result2.code).not.toMatch("input 1")
    });
})