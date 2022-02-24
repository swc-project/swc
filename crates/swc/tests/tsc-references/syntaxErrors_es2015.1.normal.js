// @Filename: badTypeArguments.js
// @ts-ignore
/** @param {C.<number,>} skipped */ /** @param {C.<number,>} y */ // @ts-ignore
/** @param {C.<number,>} skipped */ /** @param {C.<>} x */ // @ts-ignore
/** @param {C.<number,>} skipped */ /** @param {C.<number,>} y */ // @ts-ignore
/** @param {C.<number,>} skipped */ function f(x1, y, skipped) {
    return x1.t + y.t;
}
var x = f({
    t: 1000
}, {
    t: 3000
}, {
    t: 5000
});
