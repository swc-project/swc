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
function F21(x) {
    return x < 42;
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
var N1;
(function(N) {
    var F2 = function F2(x) {
        return x.toString();
    };
    var A = function A() {
        "use strict";
        _classCallCheck(this, A);
    };
    N.A = A;
    N.F2 = F2;
})(N1 || (N1 = {
}));
var aNumber = 'this is a string';
var aString = 9.9;
var aDate = 9.9;
var aVoid = 9.9;
var anInterface = new D();
var aClass = new D();
var aGenericClass = new C();
var anObjectLiteral = {
    id: 'a string'
};
var anOtherObjectLiteral = new C();
var aFunction = F21;
var anOtherFunction = F21;
var aLambda = function(x) {
    return 'a string';
};
var aModule = N1;
var aClassInModule = new N1.A();
var aFunctionInModule = F21;
