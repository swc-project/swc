import * as swcHelpers from "@swc/helpers";
var window = "foo";
console.log(typeof window === "undefined" ? "undefined" : swcHelpers.typeOf(window));
