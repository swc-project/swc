//// [discriminatedUnionInference.ts]
// Repro from #28862
foo({
    kind: "a",
    data: 42
}), foo({
    kind: "b",
    data: [
        1,
        2
    ]
});
 // number
