import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _y = new WeakMap(), Test = function() {
    "use strict";
    function Test() {
        _class_call_check(this, Test), _class_private_field_init(this, _y, {
            writable: !0,
            value: 123
        });
    }
    return Test.something = function(obj) {
        var _s, _x, _x1;
        _class_private_field_set(obj[(new (_x = new WeakMap(), function _class() {
            _class_call_check(this, _class), _class_private_field_init(this, _x, {
                writable: !0,
                value: 1
            }), this.s = "prop";
        })).s], _y, 1), _class_private_field_set(_s = obj[(new (_x1 = new WeakMap(), function _class() {
            _class_call_check(this, _class), _class_private_field_init(this, _x1, {
                writable: !0,
                value: 1
            }), this.s = "prop";
        })).s], _y, _class_private_field_get(_s, _y) + 1);
    }, Test;
}();
