//// [typeArgumentInferenceTransitiveConstraints.ts]
function fn(a, b, c) {
    return [
        a,
        b,
        c
    ];
}
var d = fn(new Date(), new Date(), new Date());
var d; // Should be OK (d should be Date[])
