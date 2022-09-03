//// [parameterInitializersBackwardReferencing.ts]
function test0() {
    var ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, _a = ref.a, a = void 0 === _a ? 0 : _a, _b = ref.b;
    return {
        a: a,
        b: void 0 === _b ? a : _b
    };
}
function test1() {
    var ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, tmp = ref.c, ref1 = void 0 === tmp ? {} : tmp, _a = ref1.a, a = void 0 === _a ? 0 : _a, _b = ref1.b;
    return {
        a: a,
        b: void 0 === _b ? a : _b
    };
}
