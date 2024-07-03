const swc = require("../pkg");

it("properly reports error", function () {
    expect(() => {
        swc.transformSync("Foo {}", {});
    }).toThrow();
});

describe("trannsform", () => {
    it("should strip types", async () => {
        const { code } = await swc.transform(
            `
        export const foo: number = 1;
        type Foo = number;
    `,
            {}
        );
        expect(code).toMatchInlineSnapshot(`
            "export const foo = 1;
            "
        `);
    });

    it("should preserve enum", async () => {
        const { code } = await swc.transform(
            `
            enum Foo {
                Bar
            }
                `,
            {}
        );
        await expect(code).toMatchInlineSnapshot(`
            "enum Foo {
                Bar
            }
            "
        `);
    });
});
