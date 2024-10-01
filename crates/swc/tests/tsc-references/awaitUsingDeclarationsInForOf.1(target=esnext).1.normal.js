//// [awaitUsingDeclarationsInForOf.1.ts]
async function main() {
    for (await using d1 of [
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
