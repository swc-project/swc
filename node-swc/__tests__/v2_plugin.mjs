import swc from '../..';

// it("should resolve", async () => {
//     const { code } = await swc.transform(`console.log("Should be removed")`, {
//         jsc: {
//             experimental: {
//                 plugins: [
//                     ['internal-test', {}]
//                 ]
//             }
//         }
//     });

//     expect(code).toMatch(``)
// })

it("should error if it's not resolved", async () => {
    await expect(swc.transform(`console.log("Should be removed")`, {
        jsc: {
            experimental: {
                plugins: [
                    ['unknown', {}]
                ]
            }
        }
    })).rejects.toThrow("failed to resolve plugin `unknown`");
})