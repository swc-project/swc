//// [awaitUsingDeclarations.2.ts]
await using d1 = {
    async [Symbol.asyncDispose] () {}
}, d2 = {
    async [Symbol.asyncDispose] () {}
}
export { };
