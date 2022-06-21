import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
var _field = new WeakMap(), A = function() {
    "use strict";
    function A() {
        var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _ref10, _ref11;
        _class_call_check(this, A), _class_private_field_init(this, _field, {
            writable: !0,
            value: 0
        }), _class_private_field_set(this, _field, 1), _class_private_field_set(this, _field, _class_private_field_get(this, _field) + 2), _class_private_field_set(this, _field, _class_private_field_get(this, _field) - 3), _class_private_field_set(this, _field, _class_private_field_get(this, _field) / 4), _class_private_field_set(this, _field, 5 * _class_private_field_get(this, _field)), _class_private_field_set(this, _field, Math.pow(_class_private_field_get(this, _field), 6)), _class_private_field_set(this, _field, _class_private_field_get(this, _field) % 7), _class_private_field_set(this, _field, _class_private_field_get(this, _field) << 8), _class_private_field_set(this, _field, _class_private_field_get(this, _field) >> 9), _class_private_field_set(this, _field, _class_private_field_get(this, _field) >>> 10), _class_private_field_set(this, _field, 11 & _class_private_field_get(this, _field)), _class_private_field_set(this, _field, 12 | _class_private_field_get(this, _field)), _class_private_field_set(this, _field, 13 ^ _class_private_field_get(this, _field)), _class_private_field_set(A.getInstance(), _field, 1), _class_private_field_set(_ref = A.getInstance(), _field, _class_private_field_get(_ref, _field) + 2), _class_private_field_set(_ref1 = A.getInstance(), _field, _class_private_field_get(_ref1, _field) - 3), _class_private_field_set(_ref2 = A.getInstance(), _field, _class_private_field_get(_ref2, _field) / 4), _class_private_field_set(_ref3 = A.getInstance(), _field, 5 * _class_private_field_get(_ref3, _field)), _class_private_field_set(_ref4 = A.getInstance(), _field, Math.pow(_class_private_field_get(_ref4, _field), 6)), _class_private_field_set(_ref5 = A.getInstance(), _field, _class_private_field_get(_ref5, _field) % 7), _class_private_field_set(_ref6 = A.getInstance(), _field, _class_private_field_get(_ref6, _field) << 8), _class_private_field_set(_ref7 = A.getInstance(), _field, _class_private_field_get(_ref7, _field) >> 9), _class_private_field_set(_ref8 = A.getInstance(), _field, _class_private_field_get(_ref8, _field) >>> 10), _class_private_field_set(_ref9 = A.getInstance(), _field, 11 & _class_private_field_get(_ref9, _field)), _class_private_field_set(_ref10 = A.getInstance(), _field, 12 | _class_private_field_get(_ref10, _field)), _class_private_field_set(_ref11 = A.getInstance(), _field, 13 ^ _class_private_field_get(_ref11, _field));
    }
    return A.getInstance = function() {
        return new A();
    }, A;
}();
