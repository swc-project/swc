var _class_call_check = require("@swc/helpers/_/_class_call_check");
var Foo = function Foo() {
    "use strict";
    _class_call_check._(this, Foo);
};
var __ = {
    writable: true,
    value: function() {
        Foo.bar = "3";
    }()
};
console.log(Foo.bar);
console.log(new Foo().bar);
