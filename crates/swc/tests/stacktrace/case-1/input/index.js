

export const foo = {
    arr: [(() => {
        throw new Error('Boom')
    })()]
};