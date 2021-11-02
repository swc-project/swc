function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
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
throw aNumber;
var aString = 'this is a string';
throw aString;
var aDate = new Date(12);
throw aDate;
var anObject = new Object();
throw anObject;
var anAny = null;
throw anAny;
var anOtherAny = new C();
throw anOtherAny;
var anUndefined = undefined;
throw anUndefined;
var aClass = new C();
throw aClass;
var aGenericClass = new D();
throw aGenericClass;
var anObjectLiteral = {
    id: 12
};
throw anObjectLiteral;
var aFunction = F;
throw aFunction;
throw aFunction('');
var aLambda = function(x) {
    return 2;
};
throw aLambda;
throw aLambda(1);
var aModule = M1;
throw aModule;
throw typeof M1 === "undefined" ? "undefined" : _typeof(M1);
var aClassInModule = new M1.A();
throw aClassInModule;
var aFunctionInModule = M1.F2;
throw aFunctionInModule;
// no initializer or annotation, so this is an 'any'
var x1;
throw x1;
// literals
throw 0;
throw false;
throw null;
throw undefined;
throw 'a string';
throw function() {
    return 'a string';
};
throw function(x) {
    return 42;
};
throw {
    x: 12,
    y: 13
};
throw [];
throw [
    'a',
    [
        'b'
    ]
];
throw /[a-z]/;
throw new Date();
throw new C();
throw new Object();
throw new D();
