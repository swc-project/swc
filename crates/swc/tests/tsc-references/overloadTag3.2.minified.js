//// [/a.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Foo = function() {
    function Foo() {
        _class_call_check(this, Foo);
    }
    var _proto = Foo.prototype;
    return _proto.bar = function(value) {}, Foo;
}();
new Foo();
