import _type_of from "@swc/helpers/lib/_type_of.js";
var window = "foo";
console.log(typeof window === "undefined" ? "undefined" : _type_of(window));
