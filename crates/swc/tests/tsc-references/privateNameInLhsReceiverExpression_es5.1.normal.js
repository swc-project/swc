// @target: es2015
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _y = /*#__PURE__*/ new WeakMap();
var Test = /*#__PURE__*/ function() {
    "use strict";
    function Test() {
        _class_call_check(this, Test);
        _class_private_field_init(this, _y, {
            writable: true,
            value: 123
        });
    }
    Test.something = function something(obj) {
        var _s;
        var _x, _x1;
        _class_private_field_set(obj[(new (_x = /*#__PURE__*/ new WeakMap(), function _class() {
            _class_call_check(this, _class);
            _class_private_field_init(this, _x, {
                writable: true,
                value: 1
            });
            this.s = "prop";
        })).s], _y, 1);
        _class_private_field_set(_s = obj[(new (_x1 = /*#__PURE__*/ new WeakMap(), function _class() {
            _class_call_check(this, _class);
            _class_private_field_init(this, _x1, {
                writable: true,
                value: 1
            });
            this.s = "prop";
        })).s], _y, _class_private_field_get(_s, _y) + 1);
    };
    return Test;
}();
