import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
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
