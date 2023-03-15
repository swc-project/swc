//// [spreadObjectOrFalsy.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
function f1(a) {
    return _extends({}, a); // Error
}
function f2(a) {
    return _extends({}, a);
}
function f3(a) {
    return _extends({}, a); // Error
}
function f4(a) {
    return _extends({}, a);
}
function f5(a) {
    return _extends({}, a);
}
function f6(a) {
    return _extends({}, a);
}
// Repro from #46976
function g1(a) {
    var z = a.z;
    return _extends({}, z);
}
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    var _proto = Foo.prototype;
    _proto.bar = function bar() {
        if (this.hasData()) {
            this.data.toLocaleLowerCase();
        }
    };
    _proto.hasData = function hasData() {
        return true;
    };
    return Foo;
}();
