//// [conditionalTypes1.ts]
f5("a"), assign({
    o: 1,
    b: 2,
    c: [
        {
            a: 1,
            c: '213'
        }
    ]
}, {
    o: 2,
    c: {
        0: {
            a: 2,
            c: '213123'
        }
    }
});
