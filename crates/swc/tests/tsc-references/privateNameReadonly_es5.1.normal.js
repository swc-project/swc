import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
var _bar, _class;
// @target: es2015
var C = (_bar = /*#__PURE__*/ new WeakSet(), _class = /*#__PURE__*/ function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
        _class_private_method_init(this, _bar);
    }
    var _proto = _class.prototype;
    _proto.foo = function foo() {
        _class_private_field_set(this, _bar, console.log("should log this then throw"));
    };
    return _class;
}(), _class);
console.log(new C().foo());
function bar() {}
