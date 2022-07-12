// @strict: true
var ref, ref1, ref2, ref3, ref4;
const n1 = a === null || a === void 0 ? void 0 : (ref = a.m) === null || ref === void 0 ? void 0 : ref.call(a, {
    x: 12
}); // should be an error (`undefined` is not assignable to `number`)
const n2 = a === null || a === void 0 ? void 0 : (ref1 = a.m) === null || ref1 === void 0 ? void 0 : ref1.call(a, {
    x: absorb()
}); // likewise
const n3 = a === null || a === void 0 ? void 0 : (ref2 = a.m) === null || ref2 === void 0 ? void 0 : ref2.call(a, {
    x: 12
}); // should be ok
const n4 = a === null || a === void 0 ? void 0 : (ref3 = a.m) === null || ref3 === void 0 ? void 0 : ref3.call(a, {
    x: absorb()
}); // likewise
// Also a test showing `!` vs `?` for good measure
let t1 = a === null || a === void 0 ? void 0 : (ref4 = a.m) === null || ref4 === void 0 ? void 0 : ref4.call(a, {
    x: 12
});
t1 = a.m({
    x: 12
});
