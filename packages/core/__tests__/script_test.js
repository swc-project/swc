const swc = require("../");

it("should handle script", () => {
    const script = swc.transformSync(`foo;`, { isModule: false });
    expect(script.code.trim()).toBe(`foo;`);
});

it("should parse as script if required", () => {
    const script = swc.parseSync(`foo;`, { isModule: false });
    expect(script.type).toBe("Script");

    const out = swc.printSync(script);
    expect(out.code.trim()).toBe(`foo;`);
});

it("should parse as module if required", () => {
    const m = swc.parseSync(`foo;`);
    expect(m.type).toBe("Module");

    const out = swc.printSync(m);
    expect(out.code.trim()).toBe(`foo;`);
});
