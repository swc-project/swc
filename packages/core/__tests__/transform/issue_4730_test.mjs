import swc from "../..";
import { dirname, join, resolve } from "path";
import { platform } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

it("should work", async () => {
    if (process.platform === "win32") {
        expect(true).toBeTruthy();
        return;
    }

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
            baseUrl: resolve("."),
            paths: {
                "@print/a": [join(dir, "./packages/a/src/index.js")],
                "@print/b": [join(dir, "./packages/b/src/index.js")],
            },
            externalHelpers: true,
        },
        module: {
            type: "commonjs",
            resolveFully: true,
        },
    });
    expect(code).toMatchInlineSnapshot(`
        ""use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
        const _b = require("../packages/b/src/index.js");
        async function display() {
            const displayA = await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("../packages/a/src/index.js"))).then((c)=>c.displayA);
            console.log(displayA());
            console.log((0, _b.displayB)());
        }
        display();
        "
    `);
});
