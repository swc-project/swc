import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
import _class_static_private_field_spec_set from "@swc/helpers/src/_class_static_private_field_spec_set.mjs";
import _construct from "@swc/helpers/src/_construct.mjs";
import _tagged_template_literal from "@swc/helpers/src/_tagged_template_literal.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
function _templateObject() {
    var data = _tagged_template_literal([
        "head",
        "middle",
        "tail"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = _tagged_template_literal([
        "test",
        "and",
        ""
    ]);
    _templateObject1 = function _templateObject1() {
        return data;
    };
    return data;
}
// @target: es2015
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    A.test = function test() {
        var _instance;
        _class_static_private_field_spec_get(this, A, _fieldFunc).call(A);
        var func = _class_static_private_field_spec_get(this, A, _fieldFunc);
        func();
        new (_class_static_private_field_spec_get(this, A, _fieldFunc))();
        var arr = [
            1,
            2
        ];
        (_instance = _class_static_private_field_spec_get(this, A, _fieldFunc2)).call.apply(_instance, [
            A,
            0
        ].concat(_to_consumable_array(arr), [
            3
        ]));
        var b = _construct(_class_static_private_field_spec_get(this, A, _fieldFunc2), [
            0
        ].concat(_to_consumable_array(arr), [
            3
        ]));
        var str = _class_static_private_field_spec_get(this, A, _fieldFunc2).bind(A)(_templateObject(), 1, 2);
        _class_static_private_field_spec_get(this.getClass(), A, _fieldFunc2).bind(A)(_templateObject1(), 1, 2);
    };
    A.getClass = function getClass() {
        return A;
    };
    return A;
}();
var _fieldFunc = {
    get: get_fieldFunc,
    set: void 0
};
var _fieldFunc2 = {
    get: get_fieldFunc2,
    set: void 0
};
var _x = {
    writable: true,
    value: 1
};
function get_fieldFunc() {
    return function() {
        _class_static_private_field_spec_set(A, A, _x, 10);
    };
}
function get_fieldFunc2() {
    return function(a) {
        for(var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            b[_key - 1] = arguments[_key];
        }
    };
}
