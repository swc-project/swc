import swc from "../..";

it("should transpile decorators", async () => {
    const source = "`${100}testing`";
    expect(swc.transformSync(source).code).toMatchInlineSnapshot(`
        """.concat(100, "testing");
        "
    `);
});
