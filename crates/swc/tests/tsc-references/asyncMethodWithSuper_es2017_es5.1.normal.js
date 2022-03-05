import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var A = // @target: es2017
// @noEmitHelpers: true
/*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    swcHelpers.createClass(A, [
        {
            key: "x",
            value: function x() {}
        },
        {
            key: "y",
            value: function y() {}
        }
    ]);
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        swcHelpers.classCallCheck(this, B);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(B, [
        {
            key: "simple",
            value: // async method with only call/get on 'super' does not require a binding
            function simple() {
                var _this = this;
                var _this1 = this, // call with property access
                _superprop_get_x = function() {
                    return swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "x", _this);
                }, // call additional property.
                _superprop_get_y = function() {
                    return swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "y", _this);
                }, // call with element access
                _superprop_get = function(_prop) {
                    return swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), _prop, _this);
                };
                return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
            }
        },
        {
            key: "advanced",
            value: // async method with assignment/destructuring on 'super' requires a binding
            function advanced() {
                var _this = this;
                var _this2 = this, // call with property access
                _superprop_get_x = function() {
                    return swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "x", _this);
                }, // call with element access
                _superprop_get = function(_prop) {
                    return swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), _prop, _this);
                }, // property access (assign)
                _superprop_set_x = function(_value) {
                    return swcHelpers.set(swcHelpers.getPrototypeOf(B.prototype), "x", _value, _this, true);
                }, // element access (assign)
                _superprop_set = function(_prop, _value) {
                    return swcHelpers.set(swcHelpers.getPrototypeOf(B.prototype), _prop, _value, _this, true);
                };
                return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
            }
        }
    ]);
    return B;
}(A);
