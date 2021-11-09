// @target: es5, es2015, esnext
// @noEmit: true
// @noTypesAndSymbols: true
// https://github.com/microsoft/TypeScript/issues/38243
function test0(param) {
    var ref = param === void 0 ? {
    } : param, _a = ref.a, a = _a === void 0 ? 0 : _a, _b = ref.b, b = _b === void 0 ? a : _b;
    return {
        a: a,
        b: b
    };
}
function test1(param) {
    var ref = param === void 0 ? {
    } : param, tmp = ref.c, ref1 = tmp === void 0 ? {
    } : tmp, _a = ref1.a, a = _a === void 0 ? 0 : _a, _b = ref1.b, b = _b === void 0 ? a : _b;
    return {
        a: a,
        b: b
    };
}
