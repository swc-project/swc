//// [awaitBinaryExpression2_es2017.ts]
async function func() {
    before();
    var b = await p && a;
    after();
}
