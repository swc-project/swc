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
        this.x = 1;
    }
    var _proto = A.prototype;
    _proto.test = function test() {
        var _instance;
        var ref;
        _class_static_private_field_spec_get(A, A, _fieldFunc).call(A);
        (ref = _class_static_private_field_spec_get(A, A, _fieldFunc)) === null || ref === void 0 ? void 0 : ref.call(A);
        var func = _class_static_private_field_spec_get(A, A, _fieldFunc);
        func();
        new (_class_static_private_field_spec_get(A, A, _fieldFunc))();
        var arr = [
            1,
            2
        ];
        (_instance = _class_static_private_field_spec_get(A, A, _fieldFunc2)).call.apply(_instance, [
            A,
            0
        ].concat(_to_consumable_array(arr), [
            3
        ]));
        var b = _construct(_class_static_private_field_spec_get(A, A, _fieldFunc2), [
            0
        ].concat(_to_consumable_array(arr), [
            3
        ]));
        var str = _class_static_private_field_spec_get(A, A, _fieldFunc2).bind(A)(_templateObject(), 1, 2);
        _class_static_private_field_spec_get(this.getClass(), A, _fieldFunc2).bind(A)(_templateObject1(), 1, 2);
    };
    _proto.getClass = function getClass() {
        return A;
    };
    return A;
}();
var _fieldFunc = {
    writable: true,
    value: function value() {
        this.x = 10;
    }
};
var _fieldFunc2 = {
    writable: true,
    value: function value(a) {
        for(var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            b[_key - 1] = arguments[_key];
        }
    }
};
