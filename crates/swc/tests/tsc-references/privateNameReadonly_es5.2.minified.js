import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _bar, C = (_bar = new WeakSet(), function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class), _class_private_method_init(this, _bar);
    }
    return _class.prototype.foo = function() {
        _class_private_field_set(this, _bar, console.log("should log this then throw"));
    }, _class;
}());
console.log(new C().foo());
