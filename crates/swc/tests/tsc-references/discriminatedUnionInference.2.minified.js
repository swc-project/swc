//// [discriminatedUnionInference.ts]
var x1 = foo({
    kind: "a",
    data: 42
}), x2 = foo({
    kind: "b",
    data: [
        1,
        2
    ]
});
