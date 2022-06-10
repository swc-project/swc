import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_static_private_field_spec_get from "@swc/helpers/lib/_class_static_private_field_spec_get.js";
import _class_static_private_field_spec_set from "@swc/helpers/lib/_class_static_private_field_spec_set.js";
import _construct from "@swc/helpers/lib/_construct.js";
import _tagged_template_literal from "@swc/helpers/lib/_tagged_template_literal.js";
import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
function _templateObject() {
    var data = _tagged_template_literal([
        "head",
        "middle",
        "tail"
    ]);
    return _templateObject = function _templateObject() {
        return data;
    }, data;
}
function _templateObject1() {
    var data = _tagged_template_literal([
        "test",
        "and",
        ""
    ]);
    return _templateObject1 = function _templateObject1() {
        return data;
    }, data;
}
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.test = function() {
        _class_static_private_field_spec_get(this, A, _fieldFunc).call(A), _class_static_private_field_spec_get(this, A, _fieldFunc)(), new (_class_static_private_field_spec_get(this, A, _fieldFunc))();
        var _instance, arr = [
            1,
            2
        ];
        (_instance = _class_static_private_field_spec_get(this, A, _fieldFunc2)).call.apply(_instance, [
            A,
            0
        ].concat(_to_consumable_array(arr), [
            3
        ])), _construct(_class_static_private_field_spec_get(this, A, _fieldFunc2), [
            0
        ].concat(_to_consumable_array(arr), [
            3
        ])), _class_static_private_field_spec_get(this, A, _fieldFunc2).bind(A)(_templateObject(), 1, 2), _class_static_private_field_spec_get(this.getClass(), A, _fieldFunc2).bind(A)(_templateObject1(), 1, 2);
    }, A.getClass = function() {
        return A;
    }, A;
}(), _fieldFunc = {
    get: function() {
        return function() {
            _class_static_private_field_spec_set(A, A, _x, 10);
        };
    },
    set: void 0
}, _fieldFunc2 = {
    get: function() {
        return function(a) {
            for(var _len = arguments.length, b = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)b[_key - 1] = arguments[_key];
        };
    },
    set: void 0
}, _x = {
    writable: !0,
    value: 1
};
