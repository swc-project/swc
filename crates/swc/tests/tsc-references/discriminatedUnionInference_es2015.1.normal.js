// @strict: true
// Repro from #28862
let x1 = foo({
    kind: 'a',
    data: 42
}); // number
let x2 = foo({
    kind: 'b',
    data: [
        1,
        2
    ]
}); // number
