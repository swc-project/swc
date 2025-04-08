const swc = require("../../");
const path = require("path");

it("should handle minify", () => {
    const src = '/* Comment */import foo, {bar} from "foo"';

    expect(
        swc
            .transformSync(src, {
                minify: true,
            })
            .code.trim()
    ).toBe(`import foo,{bar}from"foo";`);
});

it("should handle sourceMaps = false", () => {
    const src = '/* Comment */import foo, {bar} from "foo"';
    const out = swc.transformSync(src, {
        sourceMaps: false,
    });

    expect(out.map).toBeFalsy();
});

it("should handle exportNamespaceFrom", () => {
    const src = "export * as Foo from 'bar';";
    const out = swc.transformSync(src, {
        jsc: {
            parser: {
                syntax: "ecmascript",
                exportNamespaceFrom: true,
            },
        },
    });

    expect(out.code).toMatchInlineSnapshot(`
        "import * as _Foo from 'bar';
        export { _Foo as Foo };
        "
    `);
});

it("should handle jsc.target = es5", () => {
    const out = swc.transformSync(`foo.default`, {
        swcrc: false,
        jsc: {
            target: "es5",
        },
    });
    expect(out.code.trim()).toBe(`foo.default;`);
});

it("(sync) should handle module input", () => {
    const m = swc.parseSync("class Foo {}");
    const out = swc.transformSync(m, {
        swcrc: false,
        jsc: {
            target: "es2016",
        },
    });

    expect(out.code.replace(/\n/g, "")).toBe("class Foo {}");
});

it("(async) should handle module input", async () => {
    const m = await swc.parse("class Foo {}");
    const out = await swc.transform(m, {
        jsc: {
            target: "es2016",
        },
    });

    expect(out.code.replace(/\n/g, "")).toBe("class Foo {}");
});

it("(sync) should handle plugin", () => {
    const out = swc.transformSync("class Foo {}", {
        plugin: (m) => ({ ...m, body: [] }),
    });

    expect(out.code).toBe("");
});

it("(async) should handle plugin", async () => {
    const out = await swc.transform("class Foo {}", {
        plugin: (m) => ({ ...m, body: [] }),
    });

    expect(out.code).toBe("");
});

it("(async) should handle dynamic import", async () => {
    const out = await swc.transform("import('foo');", {
        jsc: {
            target: "es3",
            parser: {
                syntax: "ecmascript",
                dynamicImport: true,
            },
        },
    });

    expect(out.code.replace(/;/g, "").trim()).toMatchInlineSnapshot(
        `"import('foo')"`
    );
});

it("should handle nullish coalescing", async () => {
    const out = await swc.transform("a ?? 'foo';", {
        jsc: {
            parser: {
                syntax: "ecmascript",
                nullishCoalescing: true,
            },
        },
    });

    expect(out.code).toMatchInlineSnapshot(`
        "a !== null && a !== void 0 ? a : 'foo';
        "
    `);
});

it("should handle for of statement in an async function", async () => {
    const out = swc.transformSync(
        `async function foo() {
    for (let a of b) {
    }
  }`
    );

    expect(out.code).toBeTruthy();
});

it("should respect isModule = false", async () => {
    const out = swc.transformSync(`const five = 005`, {
        isModule: false,
    });

    expect(out.code.trim()).toEqual(`var five = 005;`);
});

it("should respect isModule = true", async () => {
    const f = () =>
        swc.transformSync(`const five = 005`, {
            isModule: true,
        });
    expect(f).toThrowError(/Syntax Error/);
});

it("should respect `inlineSourcesContent`", async () => {
    const src = '/* Comment */import foo, {bar} from "foo"';
    const { map } = await swc.transform(src, {
        sourceMaps: true,
        inlineSourcesContent: true,
    });

    const j = JSON.parse(map);

    expect(j).toHaveProperty("sourcesContent");
});

it("should respect `error.filename = false`", async () => {
    const src = "export default <h1>";
    try {
        await swc.transform(src, {
            error: {
                filename: false,
            },
        });
    } catch (e) {
        expect(e).not.toContain("-->");
    }
});

it("should support overring `jsc.externalHelpers` using js api", async () => {
    const filename = path.resolve(
        __dirname + "/../../tests/issue-3834/input.js"
    );

    const { code } = await swc.transformFile(filename, {
        jsc: {
            externalHelpers: false,
        },
    });

    expect(code).toContain("function _class_call_check");
});
