//// [awaitUsingDeclarationsInForAwaitOf.ts]
async function main() {
    for await (await using d1 of [
        {
            async [Symbol.asyncDispose] () {}
        },
        {
            [Symbol.dispose] () {}
        },
        null,
        undefined
    ]){}
}
