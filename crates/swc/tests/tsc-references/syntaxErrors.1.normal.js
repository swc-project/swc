//// [syntaxErrors.ts]
//// [dummyType.d.ts]
//// [badTypeArguments.js]
/** @param {C.<>} x */ /** @param {C.<number,>} y */ // @ts-ignore
/** @param {C.<number,>} skipped */ function f(x, y, skipped) {
    return x.t + y.t;
}
var x = f({
    t: 1000
}, {
    t: 3000
}, {
    t: 5000
});
