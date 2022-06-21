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
function F2(x) {
    return x < 42;
}
var M;
(function(M) {
    var _$F2 = function _$F2(x) {
        return x.toString();
    };
    var A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    M.A = A;
    M.F2 = _$F2;
})(M || (M = {}));
var N;
(function(N) {
    var _$F2 = function _$F2(x) {
        return x.toString();
    };
    var A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    N.A = A;
    N.F2 = _$F2;
})(N || (N = {}));
var aNumber = "this is a string";
var aString = 9.9;
var aDate = 9.9;
var aVoid = 9.9;
var anInterface = new D();
var aClass = new D();
var aGenericClass = new C();
var anObjectLiteral = {
    id: "a string"
};
var anOtherObjectLiteral = new C();
var aFunction = F2;
var anOtherFunction = F2;
var aLambda = function(x) {
    return "a string";
};
var aModule = N;
var aClassInModule = new N.A();
var aFunctionInModule = F2;
