import swc from "..";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("Should compile successfully when file name ends with `ts` but `jsc.parser.tsx = true`", () => {
    const transformedCode = "a;\n";
    it("`transformSync` and `transform` API", async () => {
        const options = {
            jsc: {
                parser: {
                    syntax: "typescript",
                    tsx: true,
                    decorators: true,
                    dynamicImport: false,
                },
            },
            sourceMaps: true,
            filename: "foo.ts",
        };
        const sourceCode = `<any>a`;
        const result1 = swc.transformSync(sourceCode, options);
        expect(result1.code).toBe(transformedCode);
        const result2 = await swc.transform(sourceCode, options);
        expect(result2.code).toBe(transformedCode);
    });

    it("`transformFile` and `transformFileSync`", async () => {
        const filename = path.resolve(
            __dirname + "/../tests/dynamic-tsx/input.ts"
        );
        const options = {
            jsc: {
                parser: {
                    syntax: "typescript",
                    tsx: true,
                    decorators: true,
                    dynamicImport: false,
                },
            },
            sourceMaps: true,
        };
        const result1 = swc.transformFileSync(filename, options);
        expect(result1.code).toBe(transformedCode);
        const result2 = await swc.transformFile(filename, options);
        expect(result2.code).toBe(transformedCode);
    });
});
