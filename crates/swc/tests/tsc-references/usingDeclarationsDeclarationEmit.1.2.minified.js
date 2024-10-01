//// [usingDeclarationsDeclarationEmit.1.ts]
using r1 = {
    [Symbol.dispose] () {}
}
await using r2 = {
    async [Symbol.asyncDispose] () {}
}
export { r1, r2 };
