import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
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
