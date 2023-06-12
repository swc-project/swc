//// [callChain.3.ts]
var _a_m, _object, _a_m1, _object1, _a_m2, _object2, _a_m3, _object3, _a_m4, _object4;
var n1 = (_object = a) === null || _object === void 0 ? void 0 : (_a_m = _object.m) === null || _a_m === void 0 ? void 0 : _a_m.call(_object, {
    x: 12
}); // should be an error (`undefined` is not assignable to `number`)
var n2 = (_object1 = a) === null || _object1 === void 0 ? void 0 : (_a_m1 = _object1.m) === null || _a_m1 === void 0 ? void 0 : _a_m1.call(_object1, {
    x: absorb()
}); // likewise
var n3 = (_object2 = a) === null || _object2 === void 0 ? void 0 : (_a_m2 = _object2.m) === null || _a_m2 === void 0 ? void 0 : _a_m2.call(_object2, {
    x: 12
}); // should be ok
var n4 = (_object3 = a) === null || _object3 === void 0 ? void 0 : (_a_m3 = _object3.m) === null || _a_m3 === void 0 ? void 0 : _a_m3.call(_object3, {
    x: absorb()
}); // likewise
// Also a test showing `!` vs `?` for good measure
var t1 = (_object4 = a) === null || _object4 === void 0 ? void 0 : (_a_m4 = _object4.m) === null || _a_m4 === void 0 ? void 0 : _a_m4.call(_object4, {
    x: 12
});
t1 = a.m({
    x: 12
});
