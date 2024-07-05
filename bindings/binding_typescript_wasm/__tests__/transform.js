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
                swc.transform(`declare enum Foo {}`, {
                    mode: "strip-only",
                })
            ).resolves.toBe("")
            await expect(
                swc.transform(`declare enum Foo {
                    A
                }`, {
                    mode: "strip-only",
                })
            ).resolves.toBe("")
            expect(
                swc.transform(`declare enum Foo {
                    a = 2,
                    b,
                    }`, {
                    mode: "strip-only",
                })
            ).toBe("")
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
