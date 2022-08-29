//// [awaitCallExpression2_es2017.ts]
async function func() {
    before();
    var b = fn(await p, a, a);
    after();
}
