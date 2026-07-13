const swc = require("../pkg");

it("properly reports error", () => {
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
            {},
        );
        expect(code).toMatchSnapshot();
    });

    describe("in strip-only mode", () => {
        it("should remove declare enum", async () => {
            await expect(
                swc.transform(`declare enum Foo {}`, {}),
            ).resolves.toMatchSnapshot();
            await expect(
                swc.transform(
                    `declare enum Foo {
                    A
                }`,
                    {},
                ),
            ).resolves.toMatchSnapshot();
            expect(
                swc.transform(
                    `declare enum Foo {
                    a = 2,
                    b,
                    }`,
                    {},
                ),
            ).resolves.toMatchSnapshot();
        });

        it("should strip type declarations", async () => {
            await expect(
                swc.transform(
                    `const foo = 1;
                    type Foo = number;
                    type Bar = string;
                    const bar: Bar = "bar";`,
                    {},
                ),
            ).resolves.toMatchSnapshot();
        });

        it("should strip type annotations", async () => {
            await expect(
                swc.transform(
                    `const foo = 1;
                    const bar: Bar = "bar";`,
                    {},
                ),
            ).resolves.toMatchSnapshot();
        });

        it("should strip type assertions", async () => {
            await expect(
                swc.transform(
                    `const foo = 1 as number;
                    const bar = "bar";`,
                    {},
                ),
            ).resolves.toMatchSnapshot();
        });

        it("should strip nonnull assertions", async () => {
            await expect(
                swc.transform(
                    `const foo = 1!;
                    const bar = "bar";`,
                    {},
                ),
            ).resolves.toMatchSnapshot();
        });

        it("should strip satisfies", async () => {
            await expect(
                swc.transform(
                    `const foo = 1 satisfies number;
                    const bar = "bar";`,
                    {},
                ),
            ).resolves.toMatchSnapshot();
        });

        it("should strip complex expressions", async () => {
            await expect(
                swc.transform(
                    `const foo = {
                        foo: 1 as number,
                        bar: "bar" as any as number,
                    } satisfies number;
                    const bar = "bar";`,
                    {},
                ),
            ).resolves.toMatchSnapshot();
        });

        it("should throw an error when it encounters an enum", async () => {
            await expect(
                swc.transform("enum Foo {}", {
                    mode: "strip-only",
                    filename: "test.ts",
                }),
            ).rejects.toMatchSnapshot();
        });

        it("should throw an error when it encounters a namespace", async () => {
            await expect(
                swc.transform("namespace Foo { export const m = 1; }", {
                    mode: "strip-only",
                    filename: "test.ts",
                }),
            ).rejects.toMatchSnapshot();
        });

        it("should throw an error when it encounters a module", async () => {
            await expect(
                swc.transform("module foo { }", {
                    mode: "strip-only",
                    deprecatedTsModuleAsError: true,
                    filename: "test.ts",
                }),
            ).rejects.toMatchSnapshot();
        });

        it("should throw an error when it encounters a module", async () => {
            await expect(
                swc.transform("declare module foo { }", {
                    mode: "strip-only",
                    deprecatedTsModuleAsError: true,
                    filename: "test.ts",
                }),
            ).rejects.toMatchSnapshot();
        });

        it("should not emit 'Caused by: failed to parse'", async () => {
            await expect(
                swc.transform("function foo() { await Promise.resolve(1); }", {
                    filename: "test.ts",
                    mode: "strip-only",
                }),
            ).rejects.toMatchSnapshot();
        });

        it("should report correct error for syntax error", async () => {
            await expect(
                swc.transform("function foo() { invalid syntax }", {
                    mode: "strip-only",
                    filename: "test.ts"
                }),
            ).rejects.toMatchSnapshot();
        });

        it("should report correct error for unsupported syntax", async () => {
            await expect(
                swc.transform(
                    `enum Foo {
                    a, b    
                    }`,
                    {
                        mode: "strip-only",
                        filename: "test.ts"
                    },
                ),
            ).rejects.toMatchSnapshot();
        });

        it("should not panic memory access out of bounds", async () => {
            expect(() => swc.transformSync(`
                var data = ""
if(!(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((data === "AED") || (data === "AFN")) || (data === "ALL")) || (data === "AMD")) || (data === "ANG")) || (data === "AOA")) || (data === "ARS")) || (data === "AUD")) || (data === "AWG")) || (data === "AZN")) || (data === "BAM")) || (data === "BBD")) || (data === "BDT")) || (data === "BGN")) || (data === "BHD")) || (data === "BIF")) || (data === "BMD")) || (data === "BND")) || (data === "BOB")) || (data === "BOV")) || (data === "BRL")) || (data === "BSD")) || (data === "BTN")) || (data === "BWP")) || (data === "BYN")) || (data === "BZD")) || (data === "CAD")) || (data === "CDF")) || (data === "CHE")) || (data === "CHF")) || (data === "CHW")) || (data === "CLF")) || (data === "CLP")) || (data === "CNY")) || (data === "COP")) || (data === "COU")) || (data === "CRC")) || (data === "CUC")) || (data === "CUP")) || (data === "CVE")) || (data === "CZK")) || (data === "DJF")) || (data === "DKK")) || (data === "DOP")) || (data === "DZD")) || (data === "EGP")) || (data === "ERN")) || (data === "ETB")) || (data === "EUR")) || (data === "FJD")) || (data === "FKP")) || (data === "GBP")) || (data === "GEL")) || (data === "GHS")) || (data === "GIP")) || (data === "GMD")) || (data === "GNF")) || (data === "GTQ")) || (data === "GYD")) || (data === "HKD")) || (data === "HNL")) || (data === "HRK")) || (data === "HTG")) || (data === "HUF")) || (data === "IDR")) || (data === "ILS")) || (data === "INR")) || (data === "IQD")) || (data === "IRR")) || (data === "ISK")) || (data === "JMD")) || (data === "JOD")) || (data === "JPY")) || (data === "KES")) || (data === "KGS")) || (data === "KHR")) || (data === "KMF")) || (data === "KPW")) || (data === "KRW")) || (data === "KWD")) || (data === "KYD")) || (data === "KZT")) || (data === "LAK")) || (data === "LBP")) || (data === "LKR")) || (data === "LRD")) || (data === "LSL")) || (data === "LYD")) || (data === "MAD")) || (data === "MDL")) || (data === "MGA")) || (data === "MKD")) || (data === "MMK")) || (data === "MNT")) || (data === "MOP")) || (data === "MRU")) || (data === "MUR")) || (data === "MVR")) || (data === "MWK")) || (data === "MXN")) || (data === "MXV")) || (data === "MYR")) || (data === "MZN")) || (data === "NAD")) || (data === "NGN")) || (data === "NIO")) || (data === "NOK")) || (data === "NPR")) || (data === "NZD")) || (data === "OMR")) || (data === "PAB")) || (data === "PEN")) || (data === "PGK")) || (data === "PHP")) || (data === "PKR")) || (data === "PLN")) || (data === "PYG")) || (data === "QAR")) || (data === "RON")) || (data === "RSD")) || (data === "RUB")) || (data === "RWF")) || (data === "SAR")) || (data === "SBD")) || (data === "SCR")) || (data === "SDG")) || (data === "SEK")) || (data === "SGD")) || (data === "SHP")) || (data === "SLL")) || (data === "SOS")) || (data === "SRD")) || (data === "SSP")) || (data === "STN")) || (data === "SVC")) || (data === "SYP")) || (data === "SZL")) || (data === "THB")) || (data === "TJS")) || (data === "TMT")) || (data === "TND")) || (data === "TOP")) || (data === "TRY")) || (data === "TTD")) || (data === "TWD")) || (data === "TZS")) || (data === "UAH")) || (data === "UGX")) || (data === "USD")) || (data === "USN")) || (data === "UYI")) || (data === "UYU")) || (data === "UYW")) || (data === "UZS")) || (data === "VES")) || (data === "VND")) || (data === "VUV")) || (data === "WST")) || (data === "XAF")) || (data === "XAG")) || (data === "XAU")) || (data === "XBA")) || (data === "XBB")) || (data === "XBC")) || (data === "XBD")) || (data === "XCD")) || (data === "XDR")) || (data === "XOF")) || (data === "XPD")) || (data === "XPF")) || (data === "XPT")) || (data === "XSU")) || (data === "XTS")) || (data === "XUA")) || (data === "XXX")) || (data === "YER")) || (data === "ZAR")) || (data === "ZMW")) || (data === "ZWL"))) {
  console.log("Hello");
}    
            `)).not.toThrow();
        })
    });

    describe("in transform mode", () => {
        it("should throw an error when it encounters a module", async () => {
            await expect(
                swc.transform("module foo { }", {
                    mode: "transform",
                    deprecatedTsModuleAsError: true,
                    filename: "test.ts"
                }),
            ).rejects.toMatchSnapshot();
        });

        it("should throw an error when it encounters a declared module", async () => {
            await expect(
                swc.transform("declare module foo { }", {
                    mode: "transform",
                    deprecatedTsModuleAsError: true,
                    filename: "test.ts",
                }),
            ).rejects.toMatchSnapshot();
        });

        it('shoud throw an object even with deprecatedTsModuleAsError = true', async () => {
            await expect(
                swc.transform("module F { export type x = number }", {
                    mode: "transform",
                    deprecatedTsModuleAsError: true,
                }),
            ).rejects.toMatchSnapshot();
        })
    });
});
