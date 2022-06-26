import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
var _obj, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C), this.baz = function() {}, this.baz = function() {};
    }
    return C.prototype.bar = function(x) {}, C;
}();
_define_property(_obj = {
    foo: ""
}, "foo", ""), _define_property(_obj, "bar", function() {}), _define_property(_obj, "bar", function() {});
