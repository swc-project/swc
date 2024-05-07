var _type_of = require("@swc/helpers/_/_type_of");
var window = "foo";
console.log(typeof window === "undefined" ? "undefined" : _type_of._(window));
