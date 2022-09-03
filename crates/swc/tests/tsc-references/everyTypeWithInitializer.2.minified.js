//// [everyTypeWithInitializer.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var M, x, C = function C() {
    "use strict";
    _class_call_check(this, C);
}, D = function D() {
    "use strict";
    _class_call_check(this, D);
};
function F(x) {
    return 42;
}
!function(M) {
    var F2 = function(x) {
        return x.toString();
    }, A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    M.A = A, M.F2 = F2;
}(M || (M = {}));
var aNumber = 9.9, aString = "this is a string", aDate = new Date(12), anObject = {}, anAny = null, anOtherAny = new C(), anUndefined = void 0, aClass = new C(), aGenericClass = new D(), anObjectLiteral = {
    id: 12
}, aFunction = F, aLambda = function(x) {
    return 2;
}, aModule = M, aClassInModule = new M.A(), aFunctionInModule = M.F2;
