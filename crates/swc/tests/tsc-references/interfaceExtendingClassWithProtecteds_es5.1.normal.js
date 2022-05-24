import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
var i;
var r = i.y;
var r2 = i.x; // error
