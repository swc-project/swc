async function f() {
    enum E { await = 1, X = await }
    return await E.X;
}
