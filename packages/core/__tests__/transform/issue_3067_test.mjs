import swc from "../..";
import { dirname, join, resolve } from "path";
import { platform } from "os";
import { fileURLToPath } from "url";
import { writeFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

it("should work with outFileExtension (commonjs)", async () => {
    if (process.platform === "win32") {
        expect(true).toBeTruthy();
        return;
    }

    const dir = join(__dirname, "..", "..", "tests", "issue-3067");
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
                "@print/c": [join(dir, "./packages/c/src/index.js")],
            },
            externalHelpers: true,
        },
        module: {
            type: "commonjs",
            resolveFully: true,
            outFileExtension: "mjs",
        },
    });
    expect(code).toMatchInlineSnapshot(`
        ""use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
        const _b = require("./inner/b/index.mjs");
        const _c = require("../packages/c/src/index.mjs");
        const _lodash = require("lodash");
        async function display() {
            const displayA = await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./inner/a/index.mjs"))).then((c)=>c.displayA);
            console.log(displayA());
            console.log((0, _b.displayB)());
            console.log((0, _c.displayC)());
            const foo = (0, _lodash.merge)({}, {
                a: 22
            });
        }
        display();
        "
    `);
});

// ESM Types
it.each([
    ['es6'],
    ['nodenext']
])("should work with outFileExtension (%s)", async (type) => {
    if (process.platform === "win32") {
        expect(true).toBeTruthy();
        return;
    }

    const dir = join(__dirname, "..", "..", "tests", "issue-3067");
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
                "@print/c": [join(dir, "./packages/c/src/index.js")],
            },
            externalHelpers: true,
        },
        module: {
            type,
            resolveFully: true,
            outFileExtension: "mjs",
        },
    });
    expect(code).toMatchInlineSnapshot(`
        "import { displayB } from "./inner/b/index.mjs";
        import { displayC } from "../packages/c/src/index.mjs";
        import { merge } from "lodash";
        async function display() {
            const displayA = await import("./inner/a/index.mjs").then((c)=>c.displayA);
            console.log(displayA());
            console.log(displayB());
            console.log(displayC());
            const foo = merge({}, {
                a: 22
            });
        }
        display();
        "
    `);
});

it("should work with outFileExtension (umd)", async () => {
    if (process.platform === "win32") {
        expect(true).toBeTruthy();
        return;
    }

    const dir = join(__dirname, "..", "..", "tests", "issue-3067");
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
                "@print/c": [join(dir, "./packages/c/src/index.js")],
            },
            externalHelpers: true,
        },
        module: {
            type: "umd",
            resolveFully: true,
            outFileExtension: "mjs",
        },
    });
    // TODO: it seems like dynamic import does not do a full resolve - this might be a fix for a different PR
    expect(code).toMatchInlineSnapshot(`
"(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/_/_interop_require_wildcard"), require("./inner/b/index.mjs"), require("../packages/c/src/index.mjs"), require("lodash"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/_/_interop_require_wildcard",
        "./inner/b/index.mjs",
        "../packages/c/src/index.mjs",
        "lodash"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.index = {}, global.interopRequireWildcard, global.indexMjs, global.indexMjs, global.lodash);
})(this, function(exports, _interop_require_wildcard, _b, _c, _lodash) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    async function display() {
        const displayA = await import('./inner/a').then((c)=>c.displayA);
        console.log(displayA());
        console.log((0, _b.displayB)());
        console.log((0, _c.displayC)());
        const foo = (0, _lodash.merge)({}, {
            a: 22
        });
    }
    display();
});
"
`);
});

it("should work with outFileExtension (amd)", async () => {
    if (process.platform === "win32") {
        expect(true).toBeTruthy();
        return;
    }

    const dir = join(__dirname, "..", "..", "tests", "issue-3067");
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
                "@print/c": [join(dir, "./packages/c/src/index.js")],
            },
            externalHelpers: true,
        },
        module: {
            type: "amd",
            resolveFully: true,
            outFileExtension: "mjs",
        },
    });
    expect(code).toMatchInlineSnapshot(`
"define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_wildcard",
    "./inner/b/index.mjs",
    "../packages/c/src/index.mjs",
    "lodash"
], function(require, exports, _interop_require_wildcard, _b, _c, _lodash) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    async function display() {
        const displayA = await new Promise((resolve, reject)=>require([
                "./inner/a/index.mjs"
            ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject)).then((c)=>c.displayA);
        console.log(displayA());
        console.log((0, _b.displayB)());
        console.log((0, _c.displayC)());
        const foo = (0, _lodash.merge)({}, {
            a: 22
        });
    }
    display();
});
"
`);
});

it("should work with outFileExtension (systemjs)", async () => {
    if (process.platform === "win32") {
        expect(true).toBeTruthy();
        return;
    }

    const dir = join(__dirname, "..", "..", "tests", "issue-3067");
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
                "@print/c": [join(dir, "./packages/c/src/index.js")],
            },
            externalHelpers: true,
        },
        module: {
            type: "systemjs",
            resolveFully: true,
            outFileExtension: "mjs",
        },
    });
    writeFileSync('foo2.txt', code)
    // TODO: it seems like dynamic import does not do a full resolve - this might be a fix for a different PR
    expect(code).toMatchInlineSnapshot(`
"System.register([
    "./inner/b/index.mjs",
    "../packages/c/src/index.mjs",
    "lodash"
], function(_export, _context) {
    "use strict";
    var displayB, displayC, merge;
    async function display() {
        const displayA = await _context.import('./inner/a').then((c)=>c.displayA);
        console.log(displayA());
        console.log(displayB());
        console.log(displayC());
        const foo = merge({}, {
            a: 22
        });
    }
    return {
        setters: [
            function(_index) {
                displayB = _index.displayB;
            },
            function(_index) {
                displayC = _index.displayC;
            },
            function(_lodash) {
                merge = _lodash.merge;
            }
        ],
        execute: function() {
            display();
        }
    };
});
"
`);
});