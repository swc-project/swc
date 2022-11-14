//// [parameterInitializersBackwardReferencing.ts]
// https://github.com/microsoft/TypeScript/issues/38243
function test0() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, _ref_a = _ref.a, a = _ref_a === void 0 ? 0 : _ref_a, _ref_b = _ref.b, b = _ref_b === void 0 ? a : _ref_b;
    return {
        a: a,
        b: b
    };
}
function test1() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, tmp = _ref.c, _ref1 = tmp === void 0 ? {} : tmp, _ref_a = _ref1.a, a = _ref_a === void 0 ? 0 : _ref_a, _ref_b = _ref1.b, b = _ref_b === void 0 ? a : _ref_b;
    return {
        a: a,
        b: b
    };
}
