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
        return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee1() {
            var f, a, b, ref, ref1;
            return regeneratorRuntime.wrap(function(_ctx1) {
                for(;;)switch(_ctx1.prev = _ctx1.next){
                    case 0:
                        var _value, _value1;
                        f = function() {}, _superprop_get_x().call(_this2), _superprop_get("x").call(_this2), a = _superprop_get_x(), b = _superprop_get("x"), _value = f, swcHelpers.set(swcHelpers.getPrototypeOf(B.prototype), "x", _value, _this, !0), _value1 = f, swcHelpers.set(swcHelpers.getPrototypeOf(B.prototype), "x", _value1, _this, !0), ref = {
                            f: f
                        }, _superprop_get_x() = ref.f, ref1 = {
                            f: f
                        }, _superprop_get("x") = ref1.f, swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function(_ctx) {
                                for(;;)switch(_ctx.prev = _ctx.next){
                                    case 0:
                                        return _ctx.abrupt("return", _superprop_get_x().call(_this2));
                                    case 1:
                                    case "end":
                                        return _ctx.stop();
                                }
                            }, _callee);
                        })), swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function(_ctx) {
                                for(;;)switch(_ctx.prev = _ctx.next){
                                    case 0:
                                        return _ctx.abrupt("return", _superprop_get("x").call(_this2));
                                    case 1:
                                    case "end":
                                        return _ctx.stop();
                                }
                            }, _callee);
                        }));
                    case 15:
                    case "end":
                        return _ctx1.stop();
                }
            }, _callee1);
        }))();
    }, _proto.property_access_only_read_only = function() {
        var _this = this, _this3 = this, _superprop_get_x = function() {
            return swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "x", _this);
        };
        return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var a;
            return regeneratorRuntime.wrap(function(_ctx2) {
                for(;;)switch(_ctx2.prev = _ctx2.next){
                    case 0:
                        _superprop_get_x().call(_this3), a = _superprop_get_x(), swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function(_ctx) {
                                for(;;)switch(_ctx.prev = _ctx.next){
                                    case 0:
                                        return _ctx.abrupt("return", _superprop_get_x().call(_this3));
                                    case 1:
                                    case "end":
                                        return _ctx.stop();
                                }
                            }, _callee);
                        }));
                    case 4:
                    case "end":
                        return _ctx2.stop();
                }
            }, _callee2);
        }))();
    }, _proto.property_access_only_write_only = function() {
        var _this = this, _superprop_get_x = function() {
            return swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "x", _this);
        }, _superprop_set_x = function(_value) {
            return swcHelpers.set(swcHelpers.getPrototypeOf(B.prototype), "x", _value, _this, !0);
        };
        return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            var f, ref;
            return regeneratorRuntime.wrap(function(_ctx3) {
                for(;;)switch(_ctx3.prev = _ctx3.next){
                    case 0:
                        _superprop_set_x(f = function() {}), ref = {
                            f: f
                        }, _superprop_get_x() = ref.f, swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function(_ctx) {
                                for(;;)switch(_ctx.prev = _ctx.next){
                                    case 0:
                                        return _ctx.abrupt("return", _superprop_set_x(f));
                                    case 1:
                                    case "end":
                                        return _ctx.stop();
                                }
                            }, _callee);
                        }));
                    case 6:
                    case "end":
                        return _ctx3.stop();
                }
            }, _callee3);
        }))();
    }, _proto.element_access_only_read_only = function() {
        var _this = this, _this4 = this, _superprop_get = function(_prop) {
            return swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), _prop, _this);
        };
        return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
            var a;
            return regeneratorRuntime.wrap(function(_ctx4) {
                for(;;)switch(_ctx4.prev = _ctx4.next){
                    case 0:
                        _superprop_get("x").call(_this4), a = _superprop_get("x"), swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function(_ctx) {
                                for(;;)switch(_ctx.prev = _ctx.next){
                                    case 0:
                                        return _ctx.abrupt("return", _superprop_get("x").call(_this4));
                                    case 1:
                                    case "end":
                                        return _ctx.stop();
                                }
                            }, _callee);
                        }));
                    case 4:
                    case "end":
                        return _ctx4.stop();
                }
            }, _callee4);
        }))();
    }, _proto.element_access_only_write_only = function() {
        var _this = this, _superprop_get = function(_prop) {
            return swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), _prop, _this);
        }, _superprop_set = function(_prop, _value) {
            return swcHelpers.set(swcHelpers.getPrototypeOf(B.prototype), _prop, _value, _this, !0);
        };
        return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
            var f, ref;
            return regeneratorRuntime.wrap(function(_ctx5) {
                for(;;)switch(_ctx5.prev = _ctx5.next){
                    case 0:
                        _superprop_set("x", f = function() {}), ref = {
                            f: f
                        }, _superprop_get("x") = ref.f, swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function(_ctx) {
                                for(;;)switch(_ctx.prev = _ctx.next){
                                    case 0:
                                        return _ctx.abrupt("return", _superprop_set("x", f));
                                    case 1:
                                    case "end":
                                        return _ctx.stop();
                                }
                            }, _callee);
                        }));
                    case 6:
                    case "end":
                        return _ctx5.stop();
                }
            }, _callee5);
        }))();
    }, _proto.property_access_only_read_only_in_generator = function() {
        var _this = this, _this5 = this, _superprop_get_x = function() {
            return swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "x", _this);
        };
        return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee6() {
            var a;
            return regeneratorRuntime.wrap(function(_ctx6) {
                for(;;)switch(_ctx6.prev = _ctx6.next){
                    case 0:
                        _superprop_get_x().call(_this5), a = _superprop_get_x(), swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function(_ctx) {
                                for(;;)switch(_ctx.prev = _ctx.next){
                                    case 0:
                                        return _ctx.abrupt("return", _superprop_get_x().call(_this5));
                                    case 1:
                                    case "end":
                                        return _ctx.stop();
                                }
                            }, _callee);
                        }));
                    case 4:
                    case "end":
                        return _ctx6.stop();
                }
            }, _callee6);
        }))();
    }, _proto.property_access_only_write_only_in_generator = function() {
        var _this = this, _superprop_get_x = function() {
            return swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "x", _this);
        }, _superprop_set_x = function(_value) {
            return swcHelpers.set(swcHelpers.getPrototypeOf(B.prototype), "x", _value, _this, !0);
        };
        return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee7() {
            var f, ref;
            return regeneratorRuntime.wrap(function(_ctx7) {
                for(;;)switch(_ctx7.prev = _ctx7.next){
                    case 0:
                        _superprop_set_x(f = function() {}), ref = {
                            f: f
                        }, _superprop_get_x() = ref.f, swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function(_ctx) {
                                for(;;)switch(_ctx.prev = _ctx.next){
                                    case 0:
                                        return _ctx.abrupt("return", _superprop_set_x(f));
                                    case 1:
                                    case "end":
                                        return _ctx.stop();
                                }
                            }, _callee);
                        }));
                    case 6:
                    case "end":
                        return _ctx7.stop();
                }
            }, _callee7);
        }))();
    }, _proto.element_access_only_read_only_in_generator = function() {
        var _this = this, _this6 = this, _superprop_get = function(_prop) {
            return swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), _prop, _this);
        };
        return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee8() {
            var a;
            return regeneratorRuntime.wrap(function(_ctx8) {
                for(;;)switch(_ctx8.prev = _ctx8.next){
                    case 0:
                        _superprop_get("x").call(_this6), a = _superprop_get("x"), swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function(_ctx) {
                                for(;;)switch(_ctx.prev = _ctx.next){
                                    case 0:
                                        return _ctx.abrupt("return", _superprop_get("x").call(_this6));
                                    case 1:
                                    case "end":
                                        return _ctx.stop();
                                }
                            }, _callee);
                        }));
                    case 4:
                    case "end":
                        return _ctx8.stop();
                }
            }, _callee8);
        }))();
    }, _proto.element_access_only_write_only_in_generator = function() {
        var _this = this, _superprop_get = function(_prop) {
            return swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), _prop, _this);
        }, _superprop_set = function(_prop, _value) {
            return swcHelpers.set(swcHelpers.getPrototypeOf(B.prototype), _prop, _value, _this, !0);
        };
        return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee9() {
            var f, ref;
            return regeneratorRuntime.wrap(function(_ctx9) {
                for(;;)switch(_ctx9.prev = _ctx9.next){
                    case 0:
                        _superprop_set("x", f = function() {}), ref = {
                            f: f
                        }, _superprop_get("x") = ref.f, swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function(_ctx) {
                                for(;;)switch(_ctx.prev = _ctx.next){
                                    case 0:
                                        return _ctx.abrupt("return", _superprop_set("x", f));
                                    case 1:
                                    case "end":
                                        return _ctx.stop();
                                }
                            }, _callee);
                        }));
                    case 6:
                    case "end":
                        return _ctx9.stop();
                }
            }, _callee9);
        }))();
    }, B;
}(A);
