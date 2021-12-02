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
export var E1;
(function(E11) {
    E11[E11["A"] = 0] = "A";
    E11[E11["B"] = 1] = "B";
    E11[E11["C"] = 2] = "C";
})(E1 || (E1 = {
}));
// @Filename: foo_1.ts
var foo = require("./foo_0");
var i;
var x = {
};
var y = false;
var z;
var e = 0;
