//// [usingDeclarationsInForAwaitOf.ts]
async function main() {
    for await (using d1 of [
        {
            [Symbol.dispose] () {}
        },
        null,
        undefined
    ]){}
}
