import swc from "../../..";
import { dirname, join } from "path";
import { platform } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

it("should work", async () => {
    const filename = join(
        __dirname,
        "..",
        "..",
        "tests",
        "issue-4730",
        "src",
        "index.ts"
    );
    console.log(filename);
    const { code } = await swc.transformFile(filename, {
        jsc: {
            parser: {
                syntax: "typescript",
                dynamicImport: true,
            },
            target: "es2020",
            paths: {
                "@print/a": [join(process.cwd(), "./packages/a/src/index.ts")],
                "@print/b": [join(process.cwd(), "./packages/b/src/index.ts")],
            },
        },
        module: {
            type: "commonjs",
        },
    });
    expect(code).toMatchInlineSnapshot(`
        "\\"use strict\\";
        "
    `);
});
