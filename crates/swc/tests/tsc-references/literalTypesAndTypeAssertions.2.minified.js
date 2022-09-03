//// [literalTypesAndTypeAssertions.ts]
var obj = {
    a: "foo",
    b: "foo",
    c: "foo"
}, x1 = 1, x2 = 1, ref = {
    a: "foo"
}, _a = ref.a, a = void 0 === _a ? "foo" : _a, ref1 = {
    b: "bar"
}, _b = ref1.b, b = void 0 === _b ? "foo" : _b, ref2 = {
    c: "bar"
}, _c = ref2.c, c = void 0 === _c ? "foo" : _c, ref3 = {
    d: "bar"
}, _d = ref3.d, d = void 0 === _d ? "foo" : _d;
