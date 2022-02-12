function AsyncGenerator(gen) {
    var front, back;
    function resume(key, arg) {
        try {
            var result = gen[key](arg), value = result.value, wrappedAwait = value instanceof _AwaitValue;
            Promise.resolve(wrappedAwait ? value.wrapped : value).then(function(arg) {
                if (wrappedAwait) {
                    resume("next", arg);
                    return;
                }
                settle(result.done ? "return" : "normal", arg);
            }, function(err) {
                resume("throw", err);
            });
        } catch (err) {
            settle("throw", err);
        }
    }
    function settle(type, value) {
        switch(type){
            case "return":
                front.resolve({
                    value: value,
                    done: !0
                });
                break;
            case "throw":
                front.reject(value);
                break;
            default:
                front.resolve({
                    value: value,
                    done: !1
                });
                break;
        }
        (front = front.next) ? resume(front.key, front.arg) : back = null;
    }
    this._invoke = function(key, arg) {
        return new Promise(function(resolve, reject) {
            var request = {
                key: key,
                arg: arg,
                resolve: resolve,
                reject: reject,
                next: null
            };
            back ? back = back.next = request : (front = back = request, resume(key, arg));
        });
    }, "function" != typeof gen.return && (this.return = void 0);
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg), value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    info.done ? resolve(value) : Promise.resolve(value).then(_next, _throw);
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(void 0);
        });
    };
}
function _AwaitValue(value) {
    this.wrapped = value;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
function _get(target, property, receiver) {
    return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function _get(target, property, receiver) {
        var base = _superPropBase(target, property);
        if (base) {
            var desc = Object.getOwnPropertyDescriptor(base, property);
            return desc.get ? desc.get.call(receiver) : desc.value;
        }
    }, _get(target, property, receiver || target);
}
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function set(target, property, value, receiver) {
    return set = "undefined" != typeof Reflect && Reflect.set ? Reflect.set : function set(target, property, value, receiver) {
        var obj, key, value, desc, base = _superPropBase(target, property);
        if (base) {
            if ((desc = Object.getOwnPropertyDescriptor(base, property)).set) return desc.set.call(receiver, value), !0;
            if (!desc.writable) return !1;
        }
        if (desc = Object.getOwnPropertyDescriptor(receiver, property)) {
            if (!desc.writable) return !1;
            desc.value = value, Object.defineProperty(receiver, property, desc);
        } else obj = receiver, (key = property) in obj ? Object.defineProperty(obj, key, {
            value: value,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : obj[key] = value;
        return !0;
    }, set(target, property, value, receiver);
}
function _set(target, property, value, receiver, isStrict) {
    if (!set(target, property, value, receiver || target) && isStrict) throw new Error("failed to set property");
    return value;
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
function _superPropBase(object, property) {
    for(; !Object.prototype.hasOwnProperty.call(object, property) && null !== (object = _getPrototypeOf(object)););
    return object;
}
function _wrapAsyncGenerator(fn) {
    return function() {
        return new AsyncGenerator(fn.apply(this, arguments));
    };
}
"function" == typeof Symbol && Symbol.asyncIterator && (AsyncGenerator.prototype[Symbol.asyncIterator] = function() {
    return this;
}), AsyncGenerator.prototype.next = function(arg) {
    return this._invoke("next", arg);
}, AsyncGenerator.prototype.throw = function(arg) {
    return this._invoke("throw", arg);
}, AsyncGenerator.prototype.return = function(arg) {
    return this._invoke("return", arg);
};
import regeneratorRuntime from "regenerator-runtime";
var A = function() {
    "use strict";
    function A() {
        _classCallCheck(this, A);
    }
    return _createClass(A, [
        {
            key: "x",
            value: function() {}
        },
        {
            key: "y",
            value: function() {}
        }
    ]), A;
}(), B = function(A) {
    "use strict";
    !function(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: !0,
                configurable: !0
            }
        }), superClass && _setPrototypeOf(subClass, superClass);
    }(B, A);
    var Derived, hasNativeReflectConstruct, _super = (Derived = B, hasNativeReflectConstruct = function() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
        } catch (e) {
            return !1;
        }
    }(), function() {
        var obj, self, call, result, Super = _getPrototypeOf(Derived);
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else result = Super.apply(this, arguments);
        return self = this, (call = result) && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : (function(self) {
            if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return self;
        })(self);
    });
    function B() {
        return _classCallCheck(this, B), _super.apply(this, arguments);
    }
    return _createClass(B, [
        {
            key: "simple",
            value: function() {
                var _this = this, _this1 = this, _superprop_get_x = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this);
                }, _superprop_get = function(_prop) {
                    return _get(_getPrototypeOf(B.prototype), _prop, _this);
                };
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    var a, b;
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _superprop_get_x().call(_this1), _get(_getPrototypeOf(B.prototype), "y", _this).call(_this1), _superprop_get("x").call(_this1), a = _superprop_get_x(), b = _superprop_get("x");
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
            value: function() {
                var _this = this, _this2 = this, _superprop_get_x = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this);
                }, _superprop_get = function(_prop) {
                    return _get(_getPrototypeOf(B.prototype), _prop, _this);
                };
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee1() {
                    var f, a, b, ref, ref1;
                    return regeneratorRuntime.wrap(function(_ctx1) {
                        for(;;)switch(_ctx1.prev = _ctx1.next){
                            case 0:
                                var _value, _value1;
                                f = function() {}, _superprop_get_x().call(_this2), _superprop_get("x").call(_this2), a = _superprop_get_x(), b = _superprop_get("x"), _value = f, _set(_getPrototypeOf(B.prototype), "x", _value, _this, !0), _value1 = f, _set(_getPrototypeOf(B.prototype), "x", _value1, _this, !0), ref = {
                                    f: f
                                }, _superprop_get_x() = ref.f, ref1 = {
                                    f: f
                                }, _superprop_get("x") = ref1.f, _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function(_ctx) {
                                        for(;;)switch(_ctx.prev = _ctx.next){
                                            case 0:
                                                return _ctx.abrupt("return", _superprop_get_x().call(_this2));
                                            case 1:
                                            case "end":
                                                return _ctx.stop();
                                        }
                                    }, _callee);
                                })), _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
            }
        },
        {
            key: "property_access_only_read_only",
            value: function() {
                var _this = this, _this3 = this, _superprop_get_x = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this);
                };
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                    var a;
                    return regeneratorRuntime.wrap(function(_ctx2) {
                        for(;;)switch(_ctx2.prev = _ctx2.next){
                            case 0:
                                _superprop_get_x().call(_this3), a = _superprop_get_x(), _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
            }
        },
        {
            key: "property_access_only_write_only",
            value: function() {
                var _this = this, _superprop_get_x = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this);
                }, _superprop_set_x = function(_value) {
                    return _set(_getPrototypeOf(B.prototype), "x", _value, _this, !0);
                };
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                    var f, ref;
                    return regeneratorRuntime.wrap(function(_ctx3) {
                        for(;;)switch(_ctx3.prev = _ctx3.next){
                            case 0:
                                _superprop_set_x(f = function() {}), ref = {
                                    f: f
                                }, _superprop_get_x() = ref.f, _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
            }
        },
        {
            key: "element_access_only_read_only",
            value: function() {
                var _this = this, _this4 = this, _superprop_get = function(_prop) {
                    return _get(_getPrototypeOf(B.prototype), _prop, _this);
                };
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                    var a;
                    return regeneratorRuntime.wrap(function(_ctx4) {
                        for(;;)switch(_ctx4.prev = _ctx4.next){
                            case 0:
                                _superprop_get("x").call(_this4), a = _superprop_get("x"), _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
            }
        },
        {
            key: "element_access_only_write_only",
            value: function() {
                var _this = this, _superprop_get = function(_prop) {
                    return _get(_getPrototypeOf(B.prototype), _prop, _this);
                }, _superprop_set = function(_prop, _value) {
                    return _set(_getPrototypeOf(B.prototype), _prop, _value, _this, !0);
                };
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                    var f, ref;
                    return regeneratorRuntime.wrap(function(_ctx5) {
                        for(;;)switch(_ctx5.prev = _ctx5.next){
                            case 0:
                                _superprop_set("x", f = function() {}), ref = {
                                    f: f
                                }, _superprop_get("x") = ref.f, _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
            }
        },
        {
            key: "property_access_only_read_only_in_generator",
            value: function() {
                var _this = this, _this5 = this, _superprop_get_x = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this);
                };
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee6() {
                    var a;
                    return regeneratorRuntime.wrap(function(_ctx6) {
                        for(;;)switch(_ctx6.prev = _ctx6.next){
                            case 0:
                                _superprop_get_x().call(_this5), a = _superprop_get_x(), _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
            }
        },
        {
            key: "property_access_only_write_only_in_generator",
            value: function() {
                var _this = this, _superprop_get_x = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this);
                }, _superprop_set_x = function(_value) {
                    return _set(_getPrototypeOf(B.prototype), "x", _value, _this, !0);
                };
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee7() {
                    var f, ref;
                    return regeneratorRuntime.wrap(function(_ctx7) {
                        for(;;)switch(_ctx7.prev = _ctx7.next){
                            case 0:
                                _superprop_set_x(f = function() {}), ref = {
                                    f: f
                                }, _superprop_get_x() = ref.f, _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
            }
        },
        {
            key: "element_access_only_read_only_in_generator",
            value: function() {
                var _this = this, _this6 = this, _superprop_get = function(_prop) {
                    return _get(_getPrototypeOf(B.prototype), _prop, _this);
                };
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee8() {
                    var a;
                    return regeneratorRuntime.wrap(function(_ctx8) {
                        for(;;)switch(_ctx8.prev = _ctx8.next){
                            case 0:
                                _superprop_get("x").call(_this6), a = _superprop_get("x"), _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
            }
        },
        {
            key: "element_access_only_write_only_in_generator",
            value: function() {
                var _this = this, _superprop_get = function(_prop) {
                    return _get(_getPrototypeOf(B.prototype), _prop, _this);
                }, _superprop_set = function(_prop, _value) {
                    return _set(_getPrototypeOf(B.prototype), _prop, _value, _this, !0);
                };
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee9() {
                    var f, ref;
                    return regeneratorRuntime.wrap(function(_ctx9) {
                        for(;;)switch(_ctx9.prev = _ctx9.next){
                            case 0:
                                _superprop_set("x", f = function() {}), ref = {
                                    f: f
                                }, _superprop_get("x") = ref.f, _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
            }
        }
    ]), B;
}(A);
