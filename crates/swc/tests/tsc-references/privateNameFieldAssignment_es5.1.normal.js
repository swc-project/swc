import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
var _field = /*#__PURE__*/ new WeakMap();
// @target: es2015
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
        var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _ref10, _ref11;
        _class_private_field_init(this, _field, {
            writable: true,
            value: 0
        });
        _class_private_field_set(this, _field, 1);
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) + 2);
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) - 3);
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) / 4);
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) * 5);
        _class_private_field_set(this, _field, Math.pow(_class_private_field_get(this, _field), 6));
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) % 7);
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) << 8);
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) >> 9);
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) >>> 10);
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) & 11);
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) | 12);
        _class_private_field_set(this, _field, _class_private_field_get(this, _field) ^ 13);
        _class_private_field_set(A.getInstance(), _field, 1);
        _class_private_field_set(_ref = A.getInstance(), _field, _class_private_field_get(_ref, _field) + 2);
        _class_private_field_set(_ref1 = A.getInstance(), _field, _class_private_field_get(_ref1, _field) - 3);
        _class_private_field_set(_ref2 = A.getInstance(), _field, _class_private_field_get(_ref2, _field) / 4);
        _class_private_field_set(_ref3 = A.getInstance(), _field, _class_private_field_get(_ref3, _field) * 5);
        _class_private_field_set(_ref4 = A.getInstance(), _field, Math.pow(_class_private_field_get(_ref4, _field), 6));
        _class_private_field_set(_ref5 = A.getInstance(), _field, _class_private_field_get(_ref5, _field) % 7);
        _class_private_field_set(_ref6 = A.getInstance(), _field, _class_private_field_get(_ref6, _field) << 8);
        _class_private_field_set(_ref7 = A.getInstance(), _field, _class_private_field_get(_ref7, _field) >> 9);
        _class_private_field_set(_ref8 = A.getInstance(), _field, _class_private_field_get(_ref8, _field) >>> 10);
        _class_private_field_set(_ref9 = A.getInstance(), _field, _class_private_field_get(_ref9, _field) & 11);
        _class_private_field_set(_ref10 = A.getInstance(), _field, _class_private_field_get(_ref10, _field) | 12);
        _class_private_field_set(_ref11 = A.getInstance(), _field, _class_private_field_get(_ref11, _field) ^ 13);
    }
    A.getInstance = function getInstance() {
        return new A();
    };
    return A;
}();
