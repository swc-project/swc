import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _class_private_method_get from "@swc/helpers/lib/_class_private_method_get.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
import _construct from "@swc/helpers/lib/_construct.js";
import _tagged_template_literal from "@swc/helpers/lib/_tagged_template_literal.js";
import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
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
function _templateObject2() {
    var data = _tagged_template_literal([
        "head",
        "middle",
        "tail"
    ]);
    _templateObject2 = function _templateObject2() {
        return data;
    };
    return data;
}
var _method = /*#__PURE__*/ new WeakSet(), _method2 = /*#__PURE__*/ new WeakSet();
// @target: es2015
var AA = /*#__PURE__*/ function() {
    "use strict";
    function AA() {
        _class_call_check(this, AA);
        _class_private_method_init(this, _method);
        _class_private_method_init(this, _method2);
        this.x = 1;
    }
    var _proto = AA.prototype;
    _proto.test = function test() {
        var _instance, _instance1;
        var _ref, _ref1, _ref2, _ref3;
        _class_private_method_get(this, _method, method).call(this);
        var func = _class_private_method_get(this, _method, method);
        func();
        new (_class_private_method_get(this, _method, method))();
        var arr = [
            1,
            2
        ];
        (_instance = _class_private_method_get(this, _method2, method2)).call.apply(_instance, [
            this,
            0
        ].concat(_to_consumable_array(arr), [
            3
        ]));
        var b = _construct(_class_private_method_get(this, _method2, method2), [
            0
        ].concat(_to_consumable_array(arr), [
            3
        ])); //Error 
        var str = _class_private_method_get(this, _method2, method2).bind(this)(_templateObject(), 1, 2);
        _class_private_method_get(_ref = this.getInstance(), _method2, method2).bind(_ref)(_templateObject1(), 1, 2);
        (_instance1 = _class_private_method_get(_ref1 = this.getInstance(), _method2, method2)).call.apply(_instance1, [
            _ref1,
            0
        ].concat(_to_consumable_array(arr), [
            3
        ]));
        var b2 = _construct(_class_private_method_get(_ref2 = this.getInstance(), _method2, method2), [
            0
        ].concat(_to_consumable_array(arr), [
            3
        ])); //Error 
        var str2 = _class_private_method_get(_ref3 = this.getInstance(), _method2, method2).bind(_ref3)(_templateObject2(), 1, 2);
    };
    _proto.getInstance = function getInstance() {
        return new AA();
    };
    return AA;
}();
function method() {
    this.x = 10;
}
function method2(a) {
    for(var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        b[_key - 1] = arguments[_key];
    }
}
