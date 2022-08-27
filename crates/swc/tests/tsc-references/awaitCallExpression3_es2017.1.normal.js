//// [awaitCallExpression3_es2017.ts]
async function func() {
    before();
    var b = fn(a, await p, a);
    after();
}
