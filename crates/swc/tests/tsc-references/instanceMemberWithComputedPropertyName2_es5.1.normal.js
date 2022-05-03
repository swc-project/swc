// https://github.com/microsoft/TypeScript/issues/33857
// @useDefineForClassFields: true
// @target: es2015
"use strict";
import * as swcHelpers from "@swc/helpers";
var x = 1;
var C = function C() {
    swcHelpers.classCallCheck(this, C);
};
