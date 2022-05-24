import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
var __ = {
    writable: true,
    value: function() {
        Foo.bar = "3";
    }()
};
console.log(Foo.bar);
console.log(new Foo().bar);
