//// [discriminatedUnionInference.ts]
foo({
    kind: 'a',
    data: 42
}), foo({
    kind: 'b',
    data: [
        1,
        2
    ]
});
