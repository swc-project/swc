import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    var _proto = A.prototype;
    return _proto.x = function() {}, _proto.y = function() {}, A;
}(), B = function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        return swcHelpers.classCallCheck(this, B), _super.apply(this, arguments);
    }
    var _proto = B.prototype;
    return _proto.simple = function() {
        var _this = this, _this1 = this, _superprop_get_x = function() {
            return swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "x", _this);
        }, _superprop_get = function(_prop) {
            return swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), _prop, _this);
        };
        return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var a, b;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _superprop_get_x().call(_this1), swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "y", _this).call(_this1), _superprop_get("x").call(_this1), a = _superprop_get_x(), b = _superprop_get("x");
                    case 5:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, _proto.advanced = function() {
        var _this = this, _this2 = this, _superprop_get_x = function() {
            return swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "x", _this);
        }, _superprop_get = function(_prop) {
            return swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), _prop, _this);
        };
        return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var f, a, b, ref, ref1;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        var _value, _value1;
                        f = function() {}, _superprop_get_x().call(_this2), _superprop_get("x").call(_this2), a = _superprop_get_x(), b = _superprop_get("x"), _value = f, swcHelpers.set(swcHelpers.getPrototypeOf(B.prototype), "x", _value, _this, !0), _value1 = f, swcHelpers.set(swcHelpers.getPrototypeOf(B.prototype), "x", _value1, _this, !0), ref = {
                            f: f
                        }, _superprop_get_x() = ref.f, ref1 = {
                            f: f
                        }, _superprop_get("x") = ref1.f;
                    case 11:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, B;
}(A);
