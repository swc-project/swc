//// [awaitClassExpression_es2017.ts]
async function func() {
    class D extends (await p) {
    }
}
