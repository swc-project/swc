import swc from '../..';

it("should compress", async () => {
    const { code } = await swc.minify(`
    import foo from '@src/app';
    console.log(foo)
    `);

    expect(code).toMatchInlineSnapshot(`"import foo from'@src/app';console.log(foo);"`);
})

it("should accept object", async () => {
    const { code } = await swc.minify(`
    import foo from '@src/app';
    console.log(foo)
    `, {});

    expect(code).toMatchInlineSnapshot(`"import foo from'@src/app';console.log(foo);"`);
})

it("should mangle", async () => {
    const { code } = await swc.minify(`
    import foo from '@src/app';
    console.log(foo)
    `, {
        compress: false,
        mangle: {},
    });

    expect(code).toMatchInlineSnapshot(`""`);
})
