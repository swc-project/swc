//// [usingDeclarationsInForOf.1.ts]
for (using d1 of [
    {
        [Symbol.dispose] () {}
    },
    null,
    undefined
]){}
