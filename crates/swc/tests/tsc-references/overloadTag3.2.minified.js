//// [/a.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Foo = function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    return Foo.prototype.bar = function(value) {}, Foo;
}();
new Foo();
