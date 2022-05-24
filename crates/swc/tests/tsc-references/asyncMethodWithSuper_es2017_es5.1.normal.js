import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _set from "@swc/helpers/lib/_set.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
import regeneratorRuntime from "regenerator-runtime";
// @target: es2017
// @noEmitHelpers: true
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    _proto.x = function x() {};
    _proto.y = function y() {};
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        return _super.apply(this, arguments);
    }
    var _proto = B.prototype;
    // async method with only call/get on 'super' does not require a binding
    _proto.simple = function simple() {
        var _this = this;
        var _this1 = this, // call with property access
        _superprop_get_x = function() {
            return _get(_get_prototype_of(B.prototype), "x", _this);
        }, // call additional property.
        _superprop_get_y = function() {
            return _get(_get_prototype_of(B.prototype), "y", _this);
        }, // call with element access
        _superprop_get = function(_prop) {
            return _get(_get_prototype_of(B.prototype), _prop, _this);
        };
        return _async_to_generator(regeneratorRuntime.mark(function _callee() {
            var a, b;
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _superprop_get_x().call(_this1);
                        _superprop_get_y().call(_this1);
                        _superprop_get("x").call(_this1);
                        a = _superprop_get_x();
                        b = _superprop_get("x");
                    case 5:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    };
    // async method with assignment/destructuring on 'super' requires a binding
    _proto.advanced = function advanced() {
        var _this = this;
        var _this2 = this, // call with property access
        _superprop_get_x = function() {
            return _get(_get_prototype_of(B.prototype), "x", _this);
        }, // call with element access
        _superprop_get = function(_prop) {
            return _get(_get_prototype_of(B.prototype), _prop, _this);
        }, // property access (assign)
        _superprop_set_x = function(_value) {
            return _set(_get_prototype_of(B.prototype), "x", _value, _this, true);
        }, // element access (assign)
        _superprop_set = function(_prop, _value) {
            return _set(_get_prototype_of(B.prototype), _prop, _value, _this, true);
        };
        return _async_to_generator(regeneratorRuntime.mark(function _callee() {
            var f, a, b, ref, ref1;
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        f = function() {};
                        _superprop_get_x().call(_this2);
                        _superprop_get("x").call(_this2);
                        a = _superprop_get_x();
                        b = _superprop_get("x");
                        _superprop_set_x(f);
                        _superprop_set("x", f);
                        ;
                        // destructuring assign with property access
                        (ref = {
                            f: f
                        }, _superprop_get_x() = ref.f, ref);
                        ;
                        // destructuring assign with element access
                        (ref1 = {
                            f: f
                        }, _superprop_get("x") = ref1.f, ref1);
                    case 11:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    };
    return B;
}(A);
