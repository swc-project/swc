function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @module: amd
// @Filename: foo_0.ts
export var C1 = function C1() {
    "use strict";
    _classCallCheck(this, C1);
    this.m1 = 42;
};
C1.s1 = true;
var E11;
export { E11 as E1 };
(function(E1) {
    E1[E1["A"] = 0] = "A";
    E1[E1["B"] = 1] = "B";
    E1[E1["C"] = 2] = "C";
})(E11 || (E11 = {
}));
// @Filename: foo_1.ts
var foo = require("./foo_0");
var i;
var x = {
};
var y = false;
var z;
var e = 0;
