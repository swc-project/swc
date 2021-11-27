import swc from '../..';

it("should resolve", async () => {
    const { code } = await swc.transform(`console.log("Should be removed")`, {
        jsc: {
            experimental: {
                plugins: ['internal-test', {}]
            }
        }
    });

    expect(code).toMatch(``)
})