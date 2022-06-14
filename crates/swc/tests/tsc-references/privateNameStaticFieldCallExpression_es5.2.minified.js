import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
import _construct from "@swc/helpers/src/_construct.mjs";
import _tagged_template_literal from "@swc/helpers/src/_tagged_template_literal.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
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
        _class_call_check(this, A), this.x = 1;
    }
    var _proto = A.prototype;
    return _proto.test = function() {
        _class_static_private_field_spec_get(A, A, _fieldFunc).call(A), null === (ref = _class_static_private_field_spec_get(A, A, _fieldFunc)) || void 0 === ref || ref.call(A), _class_static_private_field_spec_get(A, A, _fieldFunc)(), new (_class_static_private_field_spec_get(A, A, _fieldFunc))();
        var _instance, ref, arr = [
            1,
            2
        ];
        (_instance = _class_static_private_field_spec_get(A, A, _fieldFunc2)).call.apply(_instance, [
            A,
            0
        ].concat(_to_consumable_array(arr), [
            3
        ])), _construct(_class_static_private_field_spec_get(A, A, _fieldFunc2), [
            0
        ].concat(_to_consumable_array(arr), [
            3
        ])), _class_static_private_field_spec_get(A, A, _fieldFunc2).bind(A)(_templateObject(), 1, 2), _class_static_private_field_spec_get(this.getClass(), A, _fieldFunc2).bind(A)(_templateObject1(), 1, 2);
    }, _proto.getClass = function() {
        return A;
    }, A;
}(), _fieldFunc = {
    writable: !0,
    value: function() {
        this.x = 10;
    }
}, _fieldFunc2 = {
    writable: !0,
    value: function(a) {
        for(var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)b[_key - 1] = arguments[_key];
    }
};
