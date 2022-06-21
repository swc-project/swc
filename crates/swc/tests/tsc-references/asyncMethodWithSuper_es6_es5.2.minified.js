import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _set from "@swc/helpers/src/_set.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    var _proto = B.prototype;
    return _proto.simple = function() {
        var _this = this, _this1 = this, _superprop_get_x = function() {
            return _get(_get_prototype_of(B.prototype), "x", _this);
        }, _superprop_get = function(_prop) {
            return _get(_get_prototype_of(B.prototype), _prop, _this);
        };
        return _async_to_generator(regeneratorRuntime.mark(function _callee() {
            var a, b;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _superprop_get_x().call(_this1), _get(_get_prototype_of(B.prototype), "y", _this).call(_this1), _superprop_get("x").call(_this1), a = _superprop_get_x(), b = _superprop_get("x");
                    case 5:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, _proto.advanced = function() {
        var _this = this, _this1 = this, _superprop_get_x = function() {
            return _get(_get_prototype_of(B.prototype), "x", _this);
        }, _superprop_get = function(_prop) {
            return _get(_get_prototype_of(B.prototype), _prop, _this);
        };
        return _async_to_generator(regeneratorRuntime.mark(function _callee() {
            var f, a, b, ref, ref1;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        var _value, _value1;
                        f = function() {}, _superprop_get_x().call(_this1), _superprop_get("x").call(_this1), a = _superprop_get_x(), b = _superprop_get("x"), _value = f, _set(_get_prototype_of(B.prototype), "x", _value, _this, !0), _value1 = f, _set(_get_prototype_of(B.prototype), "x", _value1, _this, !0), ref = {
                            f: f
                        }, _superprop_get_x() = ref.f, ref1 = {
                            f: f
                        }, _superprop_get("x") = ref1.f, _async_to_generator(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function(_ctx) {
                                for(;;)switch(_ctx.prev = _ctx.next){
                                    case 0:
                                        return _ctx.abrupt("return", _superprop_get_x().call(_this1));
                                    case 1:
                                    case "end":
                                        return _ctx.stop();
                                }
                            }, _callee);
                        })), _async_to_generator(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function(_ctx) {
                                for(;;)switch(_ctx.prev = _ctx.next){
                                    case 0:
                                        return _ctx.abrupt("return", _superprop_get("x").call(_this1));
                                    case 1:
                                    case "end":
                                        return _ctx.stop();
                                }
                            }, _callee);
                        }));
                    case 15:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, _proto.property_access_only_read_only = function() {
        var _this = this, _this1 = this, _superprop_get_x = function() {
            return _get(_get_prototype_of(B.prototype), "x", _this);
        };
        return _async_to_generator(regeneratorRuntime.mark(function _callee() {
            var a;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _superprop_get_x().call(_this1), a = _superprop_get_x(), _async_to_generator(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function(_ctx) {
                                for(;;)switch(_ctx.prev = _ctx.next){
                                    case 0:
                                        return _ctx.abrupt("return", _superprop_get_x().call(_this1));
                                    case 1:
                                    case "end":
                                        return _ctx.stop();
                                }
                            }, _callee);
                        }));
                    case 4:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, _proto.property_access_only_write_only = function() {
        var _this = this, _superprop_get_x = function() {
            return _get(_get_prototype_of(B.prototype), "x", _this);
        }, _superprop_set_x = function(_value) {
            return _set(_get_prototype_of(B.prototype), "x", _value, _this, !0);
        };
        return _async_to_generator(regeneratorRuntime.mark(function _callee() {
            var f, ref;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _superprop_set_x(f = function() {}), ref = {
                            f: f
                        }, _superprop_get_x() = ref.f, _async_to_generator(regeneratorRuntime.mark(function _callee() {
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
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, _proto.element_access_only_read_only = function() {
        var _this = this, _this1 = this, _superprop_get = function(_prop) {
            return _get(_get_prototype_of(B.prototype), _prop, _this);
        };
        return _async_to_generator(regeneratorRuntime.mark(function _callee() {
            var a;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _superprop_get("x").call(_this1), a = _superprop_get("x"), _async_to_generator(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function(_ctx) {
                                for(;;)switch(_ctx.prev = _ctx.next){
                                    case 0:
                                        return _ctx.abrupt("return", _superprop_get("x").call(_this1));
                                    case 1:
                                    case "end":
                                        return _ctx.stop();
                                }
                            }, _callee);
                        }));
                    case 4:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, _proto.element_access_only_write_only = function() {
        var _this = this, _superprop_get = function(_prop) {
            return _get(_get_prototype_of(B.prototype), _prop, _this);
        }, _superprop_set = function(_prop, _value) {
            return _set(_get_prototype_of(B.prototype), _prop, _value, _this, !0);
        };
        return _async_to_generator(regeneratorRuntime.mark(function _callee() {
            var f, ref;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _superprop_set("x", f = function() {}), ref = {
                            f: f
                        }, _superprop_get("x") = ref.f, _async_to_generator(regeneratorRuntime.mark(function _callee() {
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
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, _proto.property_access_only_read_only_in_generator = function() {
        var _this = this, _this1 = this, _superprop_get_x = function() {
            return _get(_get_prototype_of(B.prototype), "x", _this);
        };
        return _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
            var a;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _superprop_get_x().call(_this1), a = _superprop_get_x(), _async_to_generator(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function(_ctx) {
                                for(;;)switch(_ctx.prev = _ctx.next){
                                    case 0:
                                        return _ctx.abrupt("return", _superprop_get_x().call(_this1));
                                    case 1:
                                    case "end":
                                        return _ctx.stop();
                                }
                            }, _callee);
                        }));
                    case 4:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, _proto.property_access_only_write_only_in_generator = function() {
        var _this = this, _superprop_get_x = function() {
            return _get(_get_prototype_of(B.prototype), "x", _this);
        }, _superprop_set_x = function(_value) {
            return _set(_get_prototype_of(B.prototype), "x", _value, _this, !0);
        };
        return _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
            var f, ref;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _superprop_set_x(f = function() {}), ref = {
                            f: f
                        }, _superprop_get_x() = ref.f, _async_to_generator(regeneratorRuntime.mark(function _callee() {
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
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, _proto.element_access_only_read_only_in_generator = function() {
        var _this = this, _this1 = this, _superprop_get = function(_prop) {
            return _get(_get_prototype_of(B.prototype), _prop, _this);
        };
        return _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
            var a;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _superprop_get("x").call(_this1), a = _superprop_get("x"), _async_to_generator(regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function(_ctx) {
                                for(;;)switch(_ctx.prev = _ctx.next){
                                    case 0:
                                        return _ctx.abrupt("return", _superprop_get("x").call(_this1));
                                    case 1:
                                    case "end":
                                        return _ctx.stop();
                                }
                            }, _callee);
                        }));
                    case 4:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, _proto.element_access_only_write_only_in_generator = function() {
        var _this = this, _superprop_get = function(_prop) {
            return _get(_get_prototype_of(B.prototype), _prop, _this);
        }, _superprop_set = function(_prop, _value) {
            return _set(_get_prototype_of(B.prototype), _prop, _value, _this, !0);
        };
        return _wrap_async_generator(regeneratorRuntime.mark(function _callee() {
            var f, ref;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _superprop_set("x", f = function() {}), ref = {
                            f: f
                        }, _superprop_get("x") = ref.f, _async_to_generator(regeneratorRuntime.mark(function _callee() {
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
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, B;
}(A);
