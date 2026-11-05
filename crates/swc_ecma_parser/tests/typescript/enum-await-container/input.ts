export {};
enum Top { await = 1, X = await, Y = a\u0077ait + 1 }
async function f() {
    enum Local { await = 1, X = await }
    return await Local.X;
}
