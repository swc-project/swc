import _instanceof from "@swc/helpers/src/_instanceof.mjs";
var x = "abc".concat(_instanceof("hello", String), "def");
