//// [parameterInitializersBackwardReferencing.ts]
// https://github.com/microsoft/TypeScript/issues/38243
function test0() {
    var ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, _a = ref.a, a = _a === void 0 ? 0 : _a, _b = ref.b, b = _b === void 0 ? a : _b;
    return {
        a: a,
        b: b
    };
}
function test1() {
    var ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, tmp = ref.c, ref1 = tmp === void 0 ? {} : tmp, _a = ref1.a, a = _a === void 0 ? 0 : _a, _b = ref1.b, b = _b === void 0 ? a : _b;
    return {
        a: a,
        b: b
    };
}
