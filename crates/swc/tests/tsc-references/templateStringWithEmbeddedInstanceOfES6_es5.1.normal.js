import * as swcHelpers from "@swc/helpers";
// @target: ES6
var x = "abc".concat(swcHelpers._instanceof("hello", String), "def");
