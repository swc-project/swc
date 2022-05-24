import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
var _x = /*#__PURE__*/ new WeakMap();
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
        _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        });
    }
    C.test = function test() {
        _class_private_field_set(new C(), _x, 10);
        var y = new C();
        var z = new y();
        z.x = 123;
    };
    return C;
}();
