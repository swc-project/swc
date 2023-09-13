//// [callChain.3.ts]
var _a_m, _a_m1, _a_m2, _a_m3, _a_m4;
var n1 = a === null || a === void 0 ? void 0 : (_a_m = a.m) === null || _a_m === void 0 ? void 0 : _a_m.call(a, {
    x: 12
}); // should be an error (`undefined` is not assignable to `number`)
var n2 = a === null || a === void 0 ? void 0 : (_a_m1 = a.m) === null || _a_m1 === void 0 ? void 0 : _a_m1.call(a, {
    x: absorb()
}); // likewise
var n3 = a === null || a === void 0 ? void 0 : (_a_m2 = a.m) === null || _a_m2 === void 0 ? void 0 : _a_m2.call(a, {
    x: 12
}); // should be ok
var n4 = a === null || a === void 0 ? void 0 : (_a_m3 = a.m) === null || _a_m3 === void 0 ? void 0 : _a_m3.call(a, {
    x: absorb()
}); // likewise
// Also a test showing `!` vs `?` for good measure
var t1 = a === null || a === void 0 ? void 0 : (_a_m4 = a.m) === null || _a_m4 === void 0 ? void 0 : _a_m4.call(a, {
    x: 12
});
t1 = a.m({
    x: 12
});
