import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
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
var _fieldFunc = new WeakMap(), _fieldFunc2 = new WeakMap(), A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A), _class_private_field_init(this, _fieldFunc, {
            get: get_fieldFunc,
            set: void 0
        }), _class_private_field_init(this, _fieldFunc2, {
            get: get_fieldFunc2,
            set: void 0
        }), this.x = 1;
    }
    var _proto = A.prototype;
    return _proto.test = function() {
        _class_private_field_get(this, _fieldFunc).call(this), _class_private_field_get(this, _fieldFunc)(), new (_class_private_field_get(this, _fieldFunc))();
        var _instance, _ref, arr = [
            1,
            2
        ];
        (_instance = _class_private_field_get(this, _fieldFunc2)).call.apply(_instance, [
            this,
            0
        ].concat(_to_consumable_array(arr), [
            3
        ])), _construct(_class_private_field_get(this, _fieldFunc2), [
            0
        ].concat(_to_consumable_array(arr), [
            3
        ])), _class_private_field_get(this, _fieldFunc2).bind(this)(_templateObject(), 1, 2), _class_private_field_get(_ref = this.getInstance(), _fieldFunc2).bind(_ref)(_templateObject1(), 1, 2);
    }, _proto.getInstance = function() {
        return new A();
    }, A;
}();
function get_fieldFunc() {
    return function() {
        this.x = 10;
    };
}
function get_fieldFunc2() {
    return function(a) {
        for(var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)b[_key - 1] = arguments[_key];
    };
}
