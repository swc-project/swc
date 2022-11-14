//// [literalTypesAndTypeAssertions.ts]
var obj = {
    a: "foo",
    b: "foo",
    c: "foo"
};
var x1 = 1;
var x2 = 1;
var _ref = {
    a: "foo"
}, _ref_a = _ref.a, a = _ref_a === void 0 ? "foo" : _ref_a;
var _ref1 = {
    b: "bar"
}, _ref_b = _ref1.b, b = _ref_b === void 0 ? "foo" : _ref_b;
var _ref2 = {
    c: "bar"
}, _ref_c = _ref2.c, c = _ref_c === void 0 ? "foo" : _ref_c;
var _ref3 = {
    d: "bar"
}, _ref_d = _ref3.d, d = _ref_d === void 0 ? "foo" : _ref_d;
