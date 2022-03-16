import * as swcHelpers from "@swc/helpers";
// @target: ES6
var x = "abc".concat(swcHelpers.typeOf("hi"), "def");
