import _instanceof from "@swc/helpers/src/_instanceof.mjs";
// @target: ES6
var x = _instanceof("abc".concat(0, "def"), String);
