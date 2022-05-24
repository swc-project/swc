import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _object_spread from "@swc/helpers/lib/_object_spread.js";
// @strict: true
// @declaration: true
function f1(a) {
    return _object_spread({}, a); // Error
}
function f2(a) {
    return _object_spread({}, a);
}
function f3(a) {
    return _object_spread({}, a); // Error
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
// Repro from #46976
function g1(a) {
    var z = a.z;
    return _object_spread({}, z);
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
