//// [awaitUsingDeclarations.15.ts]
async function f() {
    await using _ = {
        async [Symbol.asyncDispose] () {}
    }
    ;
}
