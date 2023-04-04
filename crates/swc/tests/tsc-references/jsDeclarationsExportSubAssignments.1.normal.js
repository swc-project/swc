//// [cls.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
