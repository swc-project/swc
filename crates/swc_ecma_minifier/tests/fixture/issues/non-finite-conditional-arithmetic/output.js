function classify(value) {
    return Number.isNaN(value) ? "NaN" : Object.is(value, -0) ? "-0" : String(value);
}
function test(flag) {
    console.log([
        flag ? 1 / 0 : 0,
        flag ? 0 : 1 / 0,
        flag ? 1 : -0,
        flag ? -0 : 1
    ].map(classify).join(","));
}
globalThis.trueValue = !0, globalThis.falseValue = !1, test(globalThis.trueValue), test(globalThis.falseValue);
