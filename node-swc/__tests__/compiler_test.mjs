import swc from '../../';

it("should minify properly", async () => {
    const { code } = await swc.minify(`
    import foo from '@src/app';
    console.log(foo)
    `);

    expect(code).toMatchInlineSnapshot(`bar/app`);
})
