//// [awaitUsingDeclarations.13.ts]
await using x = null
function f() {
    await using x = null
    ;
}
