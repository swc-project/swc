function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var D = function D() {
    "use strict";
    _classCallCheck(this, D);
};
function F(x) {
    return 42;
}
var M1;
(function(M) {
    var F2 = function F2(x) {
        return x.toString();
    };
    var A = function A() {
        "use strict";
        _classCallCheck(this, A);
    };
    M.A = A;
    M.F2 = F2;
})(M1 || (M1 = {
}));
var aNumber = 9.9;
var aString = 'this is a string';
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
var aModule = M1;
var aClassInModule = new M1.A();
var aFunctionInModule = function(x) {
    return 'this is a string';
};
