var _type_of = require("@swc/helpers/_/_type_of");
(typeof foo === "undefined" ? "undefined" : _type_of._(foo)) === "strnig";
(typeof foo === "undefined" ? "undefined" : _type_of._(foo)) == "undefimed";
(typeof bar === "undefined" ? "undefined" : _type_of._(bar)) != "nunber";
(typeof bar === "undefined" ? "undefined" : _type_of._(bar)) !== "fucntion";
(typeof bar === "undefined" ? "undefined" : _type_of._(bar)) !== foo();
(typeof bar === "undefined" ? "undefined" : _type_of._(bar)) !== ident;
// Just for test =)
(typeof foo === "undefined" ? "undefined" : _type_of._(foo)) > "strnig";
typeof bar !== "function";
(typeof x === "undefined" ? "undefined" : _type_of._(x)) === (typeof y === "undefined" ? "undefined" : _type_of._(y));
