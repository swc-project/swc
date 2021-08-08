import swc from "../../..";

it("should respect jsc.minify = false", async () => {
    const { code } = await swc.transform(`
    const hello = () => {
        console.log('hello');
    };
    `, {
        jsc: {
        },
        minify: false,
    });

    expect(code).toMatchInlineSnapshot(`"var hello = function(){\nconsole.log('hello');\n};"`);
})
