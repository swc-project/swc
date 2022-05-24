import swc from "../../..";
import { dirname, join } from "path";
import { platform } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

it("should work", async () => {
    const dir = join(__dirname, "..", "..", "tests", "issue-4730");
    const filename = join(dir, "src", "index.ts");
    console.log(filename);
    const { code } = await swc.transformFile(filename, {
        jsc: {
            parser: {
                syntax: "typescript",
                dynamicImport: true,
            },
            target: "es2020",
            paths: {
                "@print/a": [join(dir, "./packages/a/src/index.ts")],
                "@print/b": [join(dir, "./packages/b/src/index.ts")],
            },
            externalHelpers: true,
        },
        module: {
            type: "commonjs",
        },
    });
    expect(code).toMatchInlineSnapshot(`
"\\"use strict\\";
var _interop_require_wildcard = require(\\"@swc/helpers/lib/_interop_require_wildcard.js\\").default;
var _b = require(\\"../packages/b/src/index\\");
async function display() {
    const displayA = await Promise.resolve().then(function() {
        return _interop_require_wildcard(require(\\"../packages/a/src/index\\"));
    }).then((c)=>c.displayA);
    console.log(displayA());
    console.log((0, _b).displayB());
}
display();
"
`);
});
