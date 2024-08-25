import swc from "../..";

const mangleNameCache = swc.experimental_newMangleNameCache()

it('should not output same result if no name cache', async () => {
    const { code: code1 } = await swc.minify(`
        /*#__NOINLINE__*/ const fff = 1;
        export const f = fff;
    `, { toplevel: true, module: true });
    const { code: code2 } = await swc.minify(`
        /*#__NOINLINE__*/ const fff = 1;
        const eeeeee = 2;
    `, { toplevel: true, module: true })

    expect(code1).not.toBe(code2)
})


it('should output same result if name cache', async () => {
    const { code: code1 } = await swc.minify(`
        /*#__NOINLINE__*/ const fff = 1;
        export const f = fff;
    `, {
        toplevel: true,
        module: true
    }, {
        mangleNameCache
    });
    const { code: code2 } = await swc.minify(`
        /*#__NOINLINE__*/ const fff = 1;
        const eeeeee = 2;
        export const f = fff;
    `, {
        toplevel: true,
        module: true
    }, {
        mangleNameCache
    })

    expect(code1).toBe(code2)
})