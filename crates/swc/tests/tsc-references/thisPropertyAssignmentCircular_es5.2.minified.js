import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var Foo = function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo), this.foo = "Hello";
    }
    var _proto = Foo.prototype;
    return _proto.slicey = function() {
        this.foo = this.foo.slice();
    }, _proto.m = function() {
        this.foo;
    }, Foo;
}();
