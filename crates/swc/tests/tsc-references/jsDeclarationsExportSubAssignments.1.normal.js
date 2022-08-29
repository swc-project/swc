//// [cls.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Strings = {
    a: "A",
    b: "B"
};
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
module.exports = Foo;
module.exports.Strings = Strings;
