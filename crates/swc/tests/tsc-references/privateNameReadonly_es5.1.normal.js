import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _bar, _class;
// @target: es2015
var C = (_bar = /*#__PURE__*/ new WeakSet(), _class = /*#__PURE__*/ function() {
    "use strict";
    function _class1() {
        _class_call_check(this, _class1);
        _class_private_method_init(this, _bar);
    }
    var _proto = _class1.prototype;
    _proto.foo = function foo() {
        _class_private_field_set(this, _bar, console.log("should log this then throw"));
    };
    return _class1;
}(), _class);
console.log(new C().foo());
function bar() {}
