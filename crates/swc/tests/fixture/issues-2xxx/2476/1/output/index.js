import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var __ = new WeakMap();
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
__.set(Foo, {
    writable: true,
    value: function() {
        Foo.bar = "3";
    }()
});
console.log(Foo.bar);
console.log(new Foo().bar);
