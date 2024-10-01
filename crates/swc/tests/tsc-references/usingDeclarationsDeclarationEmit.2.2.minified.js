//// [usingDeclarationsDeclarationEmit.2.ts]
using r1 = {
    [Symbol.dispose] () {}
}
await using r2 = {
    async [Symbol.asyncDispose] () {}
}
export { };
