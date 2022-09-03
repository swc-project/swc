//// [everyTypeWithAnnotationAndInvalidInitializer.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var M, N, C = function C() {
    "use strict";
    _class_call_check(this, C);
}, D = function D() {
    "use strict";
    _class_call_check(this, D);
};
function F(x) {
    return 42;
}
function F2(x) {
    return x < 42;
}
!function(M) {
    var _$F2 = function(x) {
        return x.toString();
    }, A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    M.A = A, M.F2 = _$F2;
}(M || (M = {})), function(N) {
    var _$F2 = function(x) {
        return x.toString();
    }, A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    N.A = A, N.F2 = _$F2;
}(N || (N = {}));
var aNumber = "this is a string", aString = 9.9, aDate = 9.9, aVoid = 9.9, anInterface = new D(), aClass = new D(), aGenericClass = new C(), anObjectLiteral = {
    id: "a string"
}, anOtherObjectLiteral = new C(), aFunction = F2, anOtherFunction = F2, aLambda = function(x) {
    return "a string";
}, aModule = N, aClassInModule = new N.A(), aFunctionInModule = F2;
