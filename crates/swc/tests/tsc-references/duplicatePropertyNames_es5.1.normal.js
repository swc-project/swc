import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _define_property from "@swc/helpers/lib/_define_property.js";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
        this.baz = function() {};
        this.baz = function() {};
    }
    var _proto = C.prototype;
    _proto.bar = function bar(x) {};
    return C;
}();
var a;
var _obj;
var b = (_obj = {
    foo: ""
}, _define_property(_obj, "foo", ""), _define_property(_obj, "bar", function() {}), _define_property(_obj, "bar", function() {}), _obj);
