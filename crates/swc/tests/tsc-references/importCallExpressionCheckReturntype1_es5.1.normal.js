import * as swcHelpers from "@swc/helpers";
// @module: commonjs
// @target: es6
// @noImplicitAny: true
// @filename: anotherModule.ts
export var D = function D() {
    "use strict";
    swcHelpers.classCallCheck(this, D);
};
// @filename: defaultPath.ts
export var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
var p1 = import("./defaultPath");
var p2 = import("./defaultPath");
var p3 = import("./defaultPath");
