import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @module: amd
// @Filename: foo_0.ts
export var C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
    this.m1 = 42;
};
C1.s1 = true;
// @Filename: foo_1.ts
var c1 = require("./foo_0"); // Makes this an external module
var answer = 42; // No exports
// @Filename: foo_2.ts
var foo = require("./foo_1");
var x = foo; // Cause a runtime dependency
