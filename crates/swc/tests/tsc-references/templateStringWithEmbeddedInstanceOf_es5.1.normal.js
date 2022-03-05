import * as swcHelpers from "@swc/helpers";
var x = "abc".concat(swcHelpers._instanceof("hello", String), "def");
