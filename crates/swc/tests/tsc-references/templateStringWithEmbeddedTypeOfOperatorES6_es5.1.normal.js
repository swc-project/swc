import _type_of from "@swc/helpers/src/_type_of.mjs";
// @target: ES6
var x = "abc".concat(_type_of("hi"), "def");
