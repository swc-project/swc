import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
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
var _fieldFunc = /*#__PURE__*/ new WeakMap(), _fieldFunc2 = /*#__PURE__*/ new WeakMap();
// @target: es2015
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
        _class_private_field_init(this, _fieldFunc, {
            writable: true,
            value: function value() {
                this.x = 10;
            }
        });
        _class_private_field_init(this, _fieldFunc2, {
            writable: true,
            value: function value(a) {
                for(var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
                    b[_key - 1] = arguments[_key];
                }
            }
        });
        this.x = 1;
    }
    var _proto = A.prototype;
    _proto.test = function test() {
        var _instance;
        var ref;
        var _ref;
        _class_private_field_get(this, _fieldFunc).call(this);
        (ref = _class_private_field_get(this, _fieldFunc)) === null || ref === void 0 ? void 0 : ref.call(this);
        var func = _class_private_field_get(this, _fieldFunc);
        func();
        new (_class_private_field_get(this, _fieldFunc))();
        var arr = [
            1,
            2
        ];
        (_instance = _class_private_field_get(this, _fieldFunc2)).call.apply(_instance, [
            this,
            0
        ].concat(_to_consumable_array(arr), [
            3
        ]));
        var b = _construct(_class_private_field_get(this, _fieldFunc2), [
            0
        ].concat(_to_consumable_array(arr), [
            3
        ]));
        var str = _class_private_field_get(this, _fieldFunc2).bind(this)(_templateObject(), 1, 2);
        _class_private_field_get(_ref = this.getInstance(), _fieldFunc2).bind(_ref)(_templateObject1(), 1, 2);
    };
    _proto.getInstance = function getInstance() {
        return new A();
    };
    return A;
}();
