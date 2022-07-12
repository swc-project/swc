// @module: commonjs
// @target: es6
// @noImplicitAny: true
// @filename: anotherModule.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var D = function D() {
    "use strict";
    _class_call_check(this, D);
};
// @filename: defaultPath.ts
export var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var p1 = import("./defaultPath");
var p2 = import("./defaultPath");
var p3 = import("./defaultPath");
