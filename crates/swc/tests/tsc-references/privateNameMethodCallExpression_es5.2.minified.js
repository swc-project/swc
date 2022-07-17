import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
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
function _templateObject2() {
    var data = _tagged_template_literal([
        "head",
        "middle",
        "tail"
    ]);
    return _templateObject2 = function _templateObject2() {
        return data;
    }, data;
}
var _method = new WeakSet(), _method2 = new WeakSet(), AA = function() {
    "use strict";
    function AA() {
        _class_call_check(this, AA), _class_private_method_init(this, _method), _class_private_method_init(this, _method2), this.x = 1;
    }
    var _proto = AA.prototype;
    return _proto.test = function() {
        _class_private_method_get(this, _method, method).call(this), _class_private_method_get(this, _method, method)(), new (_class_private_method_get(this, _method, method))();
        var _instance, _instance1, _ref, _ref1, _ref2, arr = [
            1,
            2
        ];
        (_instance = _class_private_method_get(this, _method2, method2)).call.apply(_instance, [
            this,
            0
        ].concat(_to_consumable_array(arr), [
            3
        ])), _construct(_class_private_method_get(this, _method2, method2), [
            0
        ].concat(_to_consumable_array(arr), [
            3
        ])), _class_private_method_get(this, _method2, method2).bind(this)(_templateObject(), 1, 2), _class_private_method_get(_ref = this.getInstance(), _method2, method2).bind(_ref)(_templateObject1(), 1, 2), (_instance1 = _class_private_method_get(_ref1 = this.getInstance(), _method2, method2)).call.apply(_instance1, [
            _ref1,
            0
        ].concat(_to_consumable_array(arr), [
            3
        ])), _construct(_class_private_method_get(this.getInstance(), _method2, method2), [
            0
        ].concat(_to_consumable_array(arr), [
            3
        ])), _class_private_method_get(_ref2 = this.getInstance(), _method2, method2).bind(_ref2)(_templateObject2(), 1, 2);
    }, _proto.getInstance = function() {
        return new AA();
    }, AA;
}();
function method() {
    this.x = 10;
}
function method2(a) {
    for(var _len = arguments.length, b = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)b[_key - 1] = arguments[_key];
}
