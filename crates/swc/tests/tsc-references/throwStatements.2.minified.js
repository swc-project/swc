//// [throwStatements.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _type_of from "@swc/helpers/src/_type_of.mjs";
var aString, aDate, anObject, anAny, anOtherAny, anUndefined, aClass, aGenericClass, anObjectLiteral, aFunction, aLambda, x, aModule, aClassInModule, aFunctionInModule, x1, x2, M, C = function C() {
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
var aNumber = 9.9;
throw aNumber;
