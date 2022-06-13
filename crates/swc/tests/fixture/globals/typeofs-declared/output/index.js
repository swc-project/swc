import _type_of from "@swc/helpers/src/_type_of.mjs";
var window = "foo";
console.log(typeof window === "undefined" ? "undefined" : _type_of(window));
