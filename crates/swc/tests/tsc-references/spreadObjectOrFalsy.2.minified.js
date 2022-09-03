//// [spreadObjectOrFalsy.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
function f1(a) {
    return _object_spread({}, a);
}
function f2(a) {
    return _object_spread({}, a);
}
function f3(a) {
    return _object_spread({}, a);
}
function f4(a) {
    return _object_spread({}, a);
}
function f5(a) {
    return _object_spread({}, a);
}
function f6(a) {
    return _object_spread({}, a);
}
function g1(a) {
    return _object_spread({}, a.z);
}
var Foo = function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    var _proto = Foo.prototype;
    return _proto.bar = function() {
        this.hasData() && this.data.toLocaleLowerCase();
    }, _proto.hasData = function() {
        return !0;
    }, Foo;
}();
