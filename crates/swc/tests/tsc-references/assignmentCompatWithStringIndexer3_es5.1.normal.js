import * as swcHelpers from "@swc/helpers";
var a;
var b1;
a = b1; // error
b1 = a; // error
var Generics;
(function(Generics) {
    var foo = function foo() {
        var a1;
        var b;
        a1 = b; // error
        b = a1; // error
    };
    var A = function A() {
        "use strict";
        swcHelpers.classCallCheck(this, A);
    };
})(Generics || (Generics = {}));
