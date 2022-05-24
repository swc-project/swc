import _instanceof from "@swc/helpers/lib/_instanceof.js";
// @target: ES6
var x = "abc".concat(_instanceof("hello", String), "def");
