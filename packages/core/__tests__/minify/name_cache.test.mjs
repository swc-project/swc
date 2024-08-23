import swc from "../..";

const mangleNameCache = swc.newMangleNameCache()

it('should not output same result if no name cache', async () => {
    const { code: code1 } = await swc.minify(`
        const fff = 1;
        console.log(fff);
    `);
    const { code: code2 } = await swc.minify(`
        const fff = 1;
        const eeeeee = 2;
        console.log(fff);
    `)

    expect(code1).not.toBe(code2)
})


it('should output same result if name cache', async () => {
    const { code: code1 } = await swc.minify(`
        const fff = 1;
        console.log(fff);
    `, {}, {
        mangleNameCache
    });
    const { code: code2 } = await swc.minify(`
        const fff = 1;
        const eeeeee = 2;
        console.log(fff);
    `, {}, {
        mangleNameCache
    })

    expect(code1).toBe(code2)
})