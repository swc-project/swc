// @Filename: badTypeArguments.js
/** @param {C.<>} x */ /** @param {C.<number,>} y */ // @ts-ignore
/** @param {C.<number,>} skipped */ function f(x1, y, skipped) {
    return x1.t + y.t;
}
var x = f({
    t: 1e3
}, {
    t: 3e3
}, {
    t: 5e3
});
