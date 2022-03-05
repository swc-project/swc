import * as swcHelpers from "@swc/helpers";
// @module: commonjs
// @Filename: foo_0.ts
export var C1 = function C1() {
    "use strict";
    swcHelpers.classCallCheck(this, C1);
    this.m1 = 42;
};
C1.s1 = true;
// @Filename: foo_1.ts
var foo = require("./foo_0");
if (foo.C1.s1) {
// Should cause runtime import
}
