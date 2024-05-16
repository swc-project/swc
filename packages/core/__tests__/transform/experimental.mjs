import swc from "../..";

describe("when jsc.experimentalDisableBuiltinTransforms is true", () => {
    it("should preserve TypeScript", async () => {
        const { code } = await swc.transform(
            `
        const hello: Type = () => {
            console.log('hello');
        };
        `,
            {
                jsc: {
                    parser: {
                        syntax: "typescript",
                    },
                    experimental: {
                        disableBuiltinTransformsForInternalTesting: true,
                    },
                },
                minify: false,
            }
        );

        expect(code).toMatchInlineSnapshot(`
            "const hello: Type = ()=>{
                console.log('hello');
            };
            "
        `);
    });
});
