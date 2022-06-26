import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @module: commonjs
// @Filename: foo_0.ts
export var C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
    this.m1 = 42;
};
C1.s1 = true;
export var E1;
(function(E1) {
    E1[E1["A"] = 0] = "A";
    E1[E1["B"] = 1] = "B";
    E1[E1["C"] = 2] = "C";
})(E1 || (E1 = {}));
// @Filename: foo_1.ts
var foo = require("./foo_0");
var i;
var x = {};
var y = false;
var z;
var e = 0;
