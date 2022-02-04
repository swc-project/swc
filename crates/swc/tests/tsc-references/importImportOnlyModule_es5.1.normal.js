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
// @Filename: foo_1.ts
var c1 = require('./foo_0'); // Makes this an external module
var answer = 42; // No exports
// @Filename: foo_2.ts
var foo = require("./foo_1");
var x = foo; // Cause a runtime dependency
