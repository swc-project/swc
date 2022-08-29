//// [awaitCallExpression4_es2017.ts]
async function func() {
    before();
    var b = (await pfn)(a, a, a);
    after();
}
