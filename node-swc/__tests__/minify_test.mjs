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

it("should accpept { mangle = true }", async () => {
    const { code } = await swc.minify(`
    import foo from '@src/app';
    console.log(foo)
    `, {
        compress: false,
        mangle: true,
    });

    expect(code).toMatchInlineSnapshot(`""`);
})

it("should accpept { mangle = object }", async () => {
    const { code } = await swc.minify(`
    import foo from '@src/app';
    console.log(foo)
    `, {
        compress: false,
        mangle: {
            topLevel: true
        },
    });

    expect(code).toMatchInlineSnapshot(`""`);
})

it("should mangle locals", async () => {
    const { code } = await swc.minify(`
    (function(){
        const longName = Math.random() + '_' + Math.random();
        console.log(longName);
        console.log(longName);
        console.log(longName);
        console.log(longName);
        console.log(longName);
        console.log(longName);
    })()
    `, {
        compress: false,
        mangle: {
            topLevel: true
        },
    });

    expect(code).toMatchInlineSnapshot(`""`);
})
