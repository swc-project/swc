function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var a1;
var b1;
a1 = b1; // error
b1 = a1; // error
var Generics;
(function(Generics) {
    var foo = function foo() {
        var a;
        var b;
        a = b; // error
        b = a; // error
    };
    var A = function A() {
        "use strict";
        _classCallCheck(this, A);
    };
})(Generics || (Generics = {
}));
