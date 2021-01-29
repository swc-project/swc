const swc = require("../../../");

it("should handle minify", () => {
    const src = '/* Comment */import foo, {bar} from "foo"';

    expect(
        swc
            .transformSync(src, {
                minify: true
            })
            .code.trim()
    ).toBe(`import foo,{bar}from"foo";`);
});

it("should handle sourceMaps = false", () => {
    const src = '/* Comment */import foo, {bar} from "foo"';
    const out = swc.transformSync(src, {
        sourceMaps: false
    });

    expect(out.map).toBeFalsy();
});

it("should handle exportNamespaceFrom", () => {
    const src = "export * as Foo from 'bar';";
    const out = swc.transformSync(src, {
        jsc: {
            parser: {
                syntax: "ecmascript",
                exportNamespaceFrom: true
            }
        }
    });

    expect(out.code).toContain("import * as _Foo from 'bar';");
    expect(out.code).toContain("export { _Foo as Foo }");
});


it("should handle jsc.target = es5", () => {
    const out = swc.transformSync(`foo.default`, {
        swcrc: false,
        jsc: {
            target: "es5"
        }
    });
    expect(out.code.trim()).toBe(`foo.default;`);
});

it("(sync) should handle module input", () => {
    const m = swc.parseSync("class Foo {}");
    const out = swc.transformSync(m, {
        swcrc: false,
        jsc: {
            target: 'es2016',
        }
    });

    expect(out.code.replace(/\n/g, "")).toBe("class Foo {}");
});

it("(async) should handle module input", async () => {
    const m = await swc.parse("class Foo {}");
    const out = await swc.transform(m, {
        jsc: {
            target: "es2016"
        }
    });

    expect(out.code.replace(/\n/g, "")).toBe("class Foo {}");
});

it("(sync) should handle plugin", () => {
    const out = swc.transformSync("class Foo {}", {
        plugin: m => ({ ...m, body: [] })
    });

    expect(out.code).toBe("");
});

it("(async) should handle plugin", async () => {
    const out = await swc.transform("class Foo {}", {
        plugin: m => ({ ...m, body: [] })
    });

    expect(out.code).toBe("");
});

it("(async) should handel dynmic import", async () => {
    const out = await swc.transform("import('foo');", {
        jsc: {
            target: "es3",
            parser: {
                syntax: "ecmascript",
                dynamicImport: true
            }
        }
    });

    expect(out.code.replace(/;/g, "").trim()).toBe(`import('foo')`);
});

it("should handle nullish coalescing", async () => {
    const out = await swc.transform("a ?? 'foo';", {
        jsc: {
            parser: {
                syntax: "ecmascript",
                nullishCoalescing: true
            }
        }
    });

    expect(out.code).toBe(`a !== null && a !== void 0 ? a : 'foo';
`);
});

it("should handle for of statement in an async function", async () => {
    const out = swc.transformSync(
        `async function foo() {
    for (let a of b) {
    }
  }`
    );

    expect(out.code).toBeTruthy()
});


it("should respect isModule = false", async () => {
    const out = swc.transformSync(
        `const five = 005`,
        {
            isModule: false,
        }
    );

    expect(out.code.trim()).toEqual(`var five = 5;`)
});

it("should respect isModule = true", async () => {
    const f = () => swc.transformSync(
        `const five = 005`,
        {
            isModule: true,
        }
    );
    expect(f).toThrowError(`failed to parse module: error was recoverable, but proceeding would result in wrong codegen`)
});
