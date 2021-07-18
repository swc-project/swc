import swc from "../..";

it("should respect paths", async () => {
    const { code } = await swc.transform(`
    import foo from '@src/app';
    console.log(foo)
    `, {
        jsc: {
            parser: {
                syntax: 'typescript',
            },
            target: 'es2021',
            transform: {

            },
            paths: {
                '@src/*': ['bar/*']
            }
        },
        module: {
            type: 'commonjs'
        },
    });

    expect(code).toContain(`bar/app`);
})
