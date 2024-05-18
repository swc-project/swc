import swc from "../..";
import { dirname, join } from "path";
import { platform } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

it("should override react", async () => {
    const { code } = await swc.transform(
        `export default function foo() {
    return <div>Hello</div>;
}`,
        {
            jsc: {
                target: "es2017",
                transform: {
                    react: {
                        runtime: "automatic",
                    },
                },
                parser: {
                    syntax: "typescript",
                    tsx: true,
                    dts: true,
                    dynamicImport: true,
                },
                externalHelpers: true,
            },
            module: {
                type: "es6",
            },
        }
    );
    expect(code).toMatchInlineSnapshot(`
        "import { jsx as _jsx } from "react/jsx-runtime";
        export default function foo() {
            return /*#__PURE__*/ _jsx("div", {
                children: "Hello"
            });
        }
        "
    `);
});

it("should merge correctly", async () => {
    const filename = join(
        __dirname,
        "..",
        "..",
        "tests",
        "issue-4606",
        "1",
        "index.tsx"
    );
    console.log(filename);
    const { code } = await swc.transformFile(filename, {
        jsc: {
            parser: {
                syntax: "typescript",
                tsx: true,
                dts: true,
                dynamicImport: true,
            },
        },
        module: {
            type: "es6",
        },
    });
    // It should transpile react jsx with automatic runtime
    expect(code).toMatchInlineSnapshot(`
        "import { jsx as _jsx } from "react/jsx-runtime";
        export default function foo() {
            return /*#__PURE__*/ _jsx("div", {
                children: "Hello"
            });
        }
        "
    `);
});

it("module config should merged correctly", async () => {
    const filename = join(
        __dirname,
        "..",
        "..",
        "tests",
        "issue-4606",
        "2",
        "index.tsx"
    );
    console.log(filename);
    const { code } = await swc.transformFile(filename, {
        module: {
            type: "commonjs",
        },
    });
    // It should transpile react jsx with automatic runtime
    expect(code).toMatchInlineSnapshot(`
        ""use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        Object.defineProperty(exports, "default", {
            enumerable: true,
            get: function() {
                return foo;
            }
        });
        const _jsxruntime = require("react/jsx-runtime");
        function foo() {
            return /*#__PURE__*/ (0, _jsxruntime.jsx)("div", {
                children: "Hello"
            });
        }
        "
    `);
});
