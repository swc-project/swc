import swc from "../..";

it("should transpile decorators", async () => {
    const source = `const a = {aób: 'ó'}

    console.log(a)`;

    expect(
        swc.transformSync(source, {
            jsc: {
                parser: {
                    syntax: "ecmascript",
                    jsx: false,
                },
                target: "es5",
                loose: false,
                minify: {
                    compress: true,
                    format: {
                        asciiOnly: true,
                    },
                },
            },
            module: {
                type: "es6",
            },
            minify: false,
            isModule: true,
        }).code
    ).toMatchInlineSnapshot(`
        "console.log({
            "a\\xf3b": "\\xf3"
        });
        "
    `);
});
