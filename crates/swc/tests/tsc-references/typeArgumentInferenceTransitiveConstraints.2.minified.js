//// [typeArgumentInferenceTransitiveConstraints.ts]
function fn(a, b, c) {
    return [
        a,
        b,
        c
    ];
}
var d, d = fn(new Date(), new Date(), new Date());
