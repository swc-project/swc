import _instanceof from "@swc/helpers/src/_instanceof.mjs";
// @target: ES6
var x = "abc".concat(_instanceof("hello", String), "def");
