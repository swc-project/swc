//// [discriminatedUnionInference.ts]
// Repro from #28862
var x1 = foo({
    kind: 'a',
    data: 42
}); // number
var x2 = foo({
    kind: 'b',
    data: [
        1,
        2
    ]
}); // number
