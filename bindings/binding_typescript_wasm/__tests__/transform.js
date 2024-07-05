const swc = require("../pkg");

it("properly reports error", function () {
    expect(() => {
        swc.transformSync("Foo {}", {});
    }).toThrow();
});

describe("transform", () => {
    it("should strip types", async () => {
        const code = await swc.transform(
            `
        export const foo: number = 1;
        type Foo = number;
    `,
            {}
        );
        expect(code).toMatchSnapshot();
    });

    describe("in strip-only mode", () => {
        it("should remove declare enum", async () => {
            await expect(
                swc.transform(`declare enum Foo {}`, {})
            ).resolves.toMatchSnapshot();
            await expect(
                swc.transform(
                    `declare enum Foo {
                    A
                }`,
                    {}
                )
            ).resolves.toMatchSnapshot();
            expect(
                swc.transform(
                    `declare enum Foo {
                    a = 2,
                    b,
                    }`,
                    {}
                )
            ).resolves.toMatchSnapshot();
        });

        it("should strip type declarations", async () => {
            await expect(
                swc.transform(
                    `const foo = 1;
                    type Foo = number;
                    type Bar = string;
                    const bar: Bar = "bar";`,
                    {}
                )
            ).resolves.toMatchSnapshot();
        });

        it("should strip type annotations", async () => {
            await expect(
                swc.transform(
                    `const foo = 1;
                    const bar: Bar = "bar";`,
                    {}
                )
            ).resolves.toMatchInlineSnapshot(`
                "const foo = 1;
                                    const bar = "bar";"
            `);
        });

        it("should strip type assertions", async () => {
            await expect(
                swc.transform(
                    `const foo = 1 as number;
                    const bar = "bar";`,
                    {}
                )
            ).resolves.toMatchInlineSnapshot(`
                "const foo = 1 as number;
                                    const bar = "bar";"
            `);
        });

        it("should strip nonnull assertions", async () => {
            await expect(
                swc.transform(
                    `const foo = 1!;
                    const bar = "bar";`,
                    {}
                )
            ).resolves.toMatchInlineSnapshot(`
                "const foo = 1;
                                    const bar = "bar";"
            `);
        });

        it("should strip satisfies", async () => {
            await expect(
                swc.transform(
                    `const foo = 1 satisfies number;
                    const bar = "bar";`,
                    {}
                )
            ).resolves.toMatchInlineSnapshot(`
                "const foo = 1;
                                    const bar = "bar";"
            `);
        });

        it("should throw an error when it encounters an enum", async () => {
            await expect(
                swc.transform("enum Foo {}", {
                    mode: "strip-only",
                })
            ).rejects.toMatchSnapshot();
        });

        it("should throw an error with a descriptive message when it encounters a decorator", async () => {
            await expect(
                swc.transform("class Foo { @decorator foo() {} }", {
                    mode: "strip-only",
                })
            ).rejects.toMatchSnapshot();
        });

        it("should throw an error when it encounters a namespace", async () => {
            await expect(
                swc.transform("namespace Foo {}", {
                    mode: "strip-only",
                })
            ).rejects.toMatchSnapshot();
        });

        it("should throw an error when it encounters a module", async () => {
            await expect(
                swc.transform("module 'foo' {}", {
                    mode: "strip-only",
                })
            ).rejects.toMatchSnapshot();
        });
    });
});
