import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _set from "@swc/helpers/lib/_set.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
import regeneratorRuntime from "regenerator-runtime";
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    return _proto.x = function() {}, _proto.y = function() {}, A;
}(), B = function(A) {
    "use strict";
    _inherits(B, A);
    var _super1 = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super1.apply(this, arguments);
    }
    var _proto = B.prototype;
    return _proto.simple = function() {
        var _this = this, _this1 = this, _superprop_get_x = function() {
            return _get(_get_prototype_of(B.prototype), "x", _this);
        }, _superprop_get = function(_prop) {
            return _get(_get_prototype_of(B.prototype), _prop, _this);
        };
        return _async_to_generator(regeneratorRuntime.mark(function _callee() {
            var _super, _superIndex, a, b;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _super = null, _superIndex = null, _superprop_get_x().call(_this1), _get(_get_prototype_of(B.prototype), "y", _this).call(_this1), _superprop_get("x").call(_this1), a = _superprop_get_x(), b = _superprop_get("x");
                    case 7:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, _proto.advanced = function() {
        var _this = this, _this2 = this, _superprop_get_x = function() {
            return _get(_get_prototype_of(B.prototype), "x", _this);
        }, _superprop_get = function(_prop) {
            return _get(_get_prototype_of(B.prototype), _prop, _this);
        };
        return _async_to_generator(regeneratorRuntime.mark(function _callee() {
            var _super, _superIndex, f, a, b, ref, ref1;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        var _value, _value1;
                        _super = null, _superIndex = null, f = function() {}, _superprop_get_x().call(_this2), _superprop_get("x").call(_this2), a = _superprop_get_x(), b = _superprop_get("x"), _value = f, _set(_get_prototype_of(B.prototype), "x", _value, _this, !0), _value1 = f, _set(_get_prototype_of(B.prototype), "x", _value1, _this, !0), ref = {
                            f: f
                        }, _superprop_get_x() = ref.f, ref1 = {
                            f: f
                        }, _superprop_get("x") = ref1.f;
                    case 13:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, B;
}(A);
