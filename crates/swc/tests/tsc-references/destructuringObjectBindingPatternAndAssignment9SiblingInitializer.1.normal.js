//// [destructuringObjectBindingPatternAndAssignment9SiblingInitializer.ts]
// To be inferred as `number`
function f1() {
    var _ref = {
        a1: 1
    }, a1 = _ref.a1, _ref_b1 = _ref.b1, b1 = _ref_b1 === void 0 ? a1 : _ref_b1;
    var _ref1 = {
        a2: 1
    }, a2 = _ref1.a2, _ref_b2 = _ref1.b2, b2 = _ref_b2 === void 0 ? 1 + a2 : _ref_b2;
}
// To be inferred as `string`
function f2() {
    var _ref = {
        a1: 'hi'
    }, a1 = _ref.a1, _ref_b1 = _ref.b1, b1 = _ref_b1 === void 0 ? a1 : _ref_b1;
    var _ref1 = {
        a2: 'hi'
    }, a2 = _ref1.a2, _ref_b2 = _ref1.b2, b2 = _ref_b2 === void 0 ? a2 + '!' : _ref_b2;
}
// To be inferred as `string | number`
function f3() {
    var _ref = {
        a1: 'hi',
        b1: 1
    }, a1 = _ref.a1, _ref_b1 = _ref.b1, b1 = _ref_b1 === void 0 ? a1 : _ref_b1;
    var _ref1 = {
        a2: 'hi',
        b2: 1
    }, a2 = _ref1.a2, _ref_b2 = _ref1.b2, b2 = _ref_b2 === void 0 ? a2 + '!' : _ref_b2;
}
function f4() {
    var _ref = yadda !== null && yadda !== void 0 ? yadda : {}, a = _ref.a, _ref_b = _ref.b, b = _ref_b === void 0 ? a : _ref_b;
}
