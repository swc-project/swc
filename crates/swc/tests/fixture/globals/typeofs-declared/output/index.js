import { _ as _type_of } from "@swc/helpers/_/_type_of";
var window = "foo";
console.log(typeof window === "undefined" ? "undefined" : _type_of(window));
