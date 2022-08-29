//// [literalTypesAndTypeAssertions.ts]
var obj = {
    a: "foo",
    b: "foo",
    c: "foo"
};
var x1 = 1;
var x2 = 1;
var ref = {
    a: "foo"
}, _a = ref.a, a = _a === void 0 ? "foo" : _a;
var ref1 = {
    b: "bar"
}, _b = ref1.b, b = _b === void 0 ? "foo" : _b;
var ref2 = {
    c: "bar"
}, _c = ref2.c, c = _c === void 0 ? "foo" : _c;
var ref3 = {
    d: "bar"
}, _d = ref3.d, d = _d === void 0 ? "foo" : _d;
