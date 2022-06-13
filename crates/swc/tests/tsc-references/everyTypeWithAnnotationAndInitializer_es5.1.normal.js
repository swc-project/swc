import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var D = function D() {
    "use strict";
    _class_call_check(this, D);
};
function F(x) {
    return 42;
}
var M;
(function(M1) {
    var F2 = function F2(x) {
        return x.toString();
    };
    var A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    M1.A = A;
    M1.F2 = F2;
})(M || (M = {}));
var aNumber = 9.9;
var aString = "this is a string";
var aDate = new Date(12);
var anObject = new Object();
var anAny = null;
var aSecondAny = undefined;
var aVoid = undefined;
var anInterface = new C();
var aClass = new C();
var aGenericClass = new D();
var anObjectLiteral = {
    id: 12
};
var anOtherObjectLiteral = new C();
var aFunction = F;
var anOtherFunction = F;
var aLambda = function(x) {
    return 2;
};
var aModule = M;
var aClassInModule = new M.A();
var aFunctionInModule = function(x) {
    return "this is a string";
};
