//// [syntaxErrors.ts]
//// [dummyType.d.ts]
//// [badTypeArguments.js]
function f(x, y, skipped) {
    return x.t + y.t;
}
var x = f({
    t: 1000
}, {
    t: 3000
}, {
    t: 5000
});
