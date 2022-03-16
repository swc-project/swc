import * as swcHelpers from "@swc/helpers";
// @target: ES6
var x = swcHelpers._instanceof("abc".concat(0, "def"), String);
