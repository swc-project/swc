//// [callChain.3.ts]
var _a_m, _a, _a_m1, _a1, _a_m2, _a2, _a_m3, _a3, _a_m4, _a4;
var n1 = (_a = a) === null || _a === void 0 ? void 0 : (_a_m = _a.m) === null || _a_m === void 0 ? void 0 : _a_m.call(_a, {
    x: 12
}); // should be an error (`undefined` is not assignable to `number`)
var n2 = (_a1 = a) === null || _a1 === void 0 ? void 0 : (_a_m1 = _a1.m) === null || _a_m1 === void 0 ? void 0 : _a_m1.call(_a1, {
    x: absorb()
}); // likewise
var n3 = (_a2 = a) === null || _a2 === void 0 ? void 0 : (_a_m2 = _a2.m) === null || _a_m2 === void 0 ? void 0 : _a_m2.call(_a2, {
    x: 12
}); // should be ok
var n4 = (_a3 = a) === null || _a3 === void 0 ? void 0 : (_a_m3 = _a3.m) === null || _a_m3 === void 0 ? void 0 : _a_m3.call(_a3, {
    x: absorb()
}); // likewise
// Also a test showing `!` vs `?` for good measure
var t1 = (_a4 = a) === null || _a4 === void 0 ? void 0 : (_a_m4 = _a4.m) === null || _a_m4 === void 0 ? void 0 : _a_m4.call(_a4, {
    x: 12
});
t1 = a.m({
    x: 12
});
