import regeneratorRuntime from "regenerator-runtime";
function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function AsyncGenerator(gen) {
    var front, back;
    function send(key, arg) {
        return new Promise(function(resolve, reject) {
            var request = {
                key: key,
                arg: arg,
                resolve: resolve,
                reject: reject,
                next: null
            };
            if (back) {
                back = back.next = request;
            } else {
                front = back = request;
                resume(key, arg);
            }
        });
    }
    function resume(key, arg) {
        try {
            var result = gen[key](arg);
            var value = result.value;
            var wrappedAwait = value instanceof _AwaitValue;
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
                    done: true
                });
                break;
            case "throw":
                front.reject(value);
                break;
            default:
                front.resolve({
                    value: value,
                    done: false
                });
                break;
        }
        front = front.next;
        if (front) {
            resume(front.key, front.arg);
        } else {
            back = null;
        }
    }
    this._invoke = send;
    if (typeof gen.return !== "function") {
        this.return = undefined;
    }
}
if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function() {
        return this;
    };
}
AsyncGenerator.prototype.next = function(arg) {
    return this._invoke("next", arg);
};
AsyncGenerator.prototype.throw = function(arg) {
    return this._invoke("throw", arg);
};
AsyncGenerator.prototype.return = function(arg) {
    return this._invoke("return", arg);
};
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
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
            _next(undefined);
        });
    };
}
function _AwaitValue(value) {
    this.wrapped = value;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
        _get = Reflect.get;
    } else {
        _get = function _get(target, property, receiver) {
            var base = _superPropBase(target, property);
            if (!base) return;
            var desc = Object.getOwnPropertyDescriptor(base, property);
            if (desc.get) {
                return desc.get.call(receiver);
            }
            return desc.value;
        };
    }
    return _get(target, property, receiver || target);
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function set(target, property, value, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.set) {
        set = Reflect.set;
    } else {
        set = function set(target, property, value, receiver) {
            var base = _superPropBase(target, property);
            var desc;
            if (base) {
                desc = Object.getOwnPropertyDescriptor(base, property);
                if (desc.set) {
                    desc.set.call(receiver, value);
                    return true;
                } else if (!desc.writable) {
                    return false;
                }
            }
            desc = Object.getOwnPropertyDescriptor(receiver, property);
            if (desc) {
                if (!desc.writable) {
                    return false;
                }
                desc.value = value;
                Object.defineProperty(receiver, property, desc);
            } else {
                _defineProperty(receiver, property, value);
            }
            return true;
        };
    }
    return set(target, property, value, receiver);
}
function _set(target, property, value, receiver, isStrict) {
    var s = set(target, property, value, receiver || target);
    if (!s && isStrict) {
        throw new Error("failed to set property");
    }
    return value;
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
function _superPropBase(object, property) {
    while(!Object.prototype.hasOwnProperty.call(object, property)){
        object = _getPrototypeOf(object);
        if (object === null) break;
    }
    return object;
}
var _typeof = function(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _wrapAsyncGenerator(fn) {
    return function() {
        return new AsyncGenerator(fn.apply(this, arguments));
    };
}
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
var A = // @target: ES6
// @lib: esnext
// @noEmitHelpers: true
/*#__PURE__*/ function() {
    "use strict";
    function A() {
        _classCallCheck(this, A);
    }
    _createClass(A, [
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
    _inherits(B, A);
    var _super = _createSuper(B);
    function B() {
        _classCallCheck(this, B);
        return _super.apply(this, arguments);
    }
    _createClass(B, [
        {
            key: "simple",
            value: // async method with only call/get on 'super' does not require a binding
            function simple() {
                var _this = this;
                var _this1 = this, // call additional property.
                _superprop_get_y = function() {
                    return _get(_getPrototypeOf(B.prototype), "y", _this);
                }, // call with property access
                _superprop_get_x = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this);
                }, // call with element access
                _superprop_get = function(_prop) {
                    return _get(_getPrototypeOf(B.prototype), _prop, _this);
                };
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
                    return _get(_getPrototypeOf(B.prototype), "x", _this);
                }, // call with element access
                _superprop_get = function(_prop) {
                    return _get(_getPrototypeOf(B.prototype), _prop, _this);
                }, _superprop_set_x = function(_value) {
                    return _set(_getPrototypeOf(B.prototype), "x", _value, _this, true);
                }, // element access (assign)
                _superprop_set = function(_prop, _value) {
                    return _set(_getPrototypeOf(B.prototype), _prop, _value, _this, true);
                };
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee1() {
                    var f, a, b, ref, ref1;
                    return regeneratorRuntime.wrap(function _callee$(_ctx1) {
                        while(1)switch(_ctx1.prev = _ctx1.next){
                            case 0:
                                f = function() {};
                                _superprop_get_x().call(_this2);
                                _superprop_get("x").call(_this2);
                                a = _superprop_get_x();
                                b = _superprop_get("x");
                                // property access (assign)
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
                                // property access in arrow
                                (function() {
                                    return _superprop_get_x().call(_this2);
                                });
                                // element access in arrow
                                (function() {
                                    return _superprop_get("x").call(_this2);
                                });
                                // property access in async arrow
                                _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
                                            case 0:
                                                return _ctx.abrupt("return", _superprop_get_x().call(_this2));
                                            case 1:
                                            case "end":
                                                return _ctx.stop();
                                        }
                                    }, _callee);
                                }));
                                // element access in async arrow
                                _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
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
            value: function property_access_only_read_only() {
                var _this = this;
                var _this3 = this, // call with property access
                _superprop_get_x = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this);
                };
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                    var a;
                    return regeneratorRuntime.wrap(function _callee$(_ctx2) {
                        while(1)switch(_ctx2.prev = _ctx2.next){
                            case 0:
                                _superprop_get_x().call(_this3);
                                a = _superprop_get_x();
                                // property access in arrow
                                (function() {
                                    return _superprop_get_x().call(_this3);
                                });
                                // property access in async arrow
                                _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
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
            value: function property_access_only_write_only() {
                var _this = this;
                var _superprop_get_x = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this);
                }, _superprop_set_x = function(_value) {
                    return _set(_getPrototypeOf(B.prototype), "x", _value, _this, true);
                };
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                    var f, ref;
                    return regeneratorRuntime.wrap(function _callee$(_ctx3) {
                        while(1)switch(_ctx3.prev = _ctx3.next){
                            case 0:
                                f = function() {};
                                // property access (assign)
                                _superprop_set_x(f);
                                ;
                                // destructuring assign with property access
                                (ref = {
                                    f: f
                                }, _superprop_get_x() = ref.f, ref);
                                // property access (assign) in arrow
                                (function() {
                                    return _superprop_set_x(f);
                                });
                                // property access (assign) in async arrow
                                _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
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
            value: function element_access_only_read_only() {
                var _this = this;
                var _this4 = this, // call with element access
                _superprop_get = function(_prop) {
                    return _get(_getPrototypeOf(B.prototype), _prop, _this);
                };
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                    var a;
                    return regeneratorRuntime.wrap(function _callee$(_ctx4) {
                        while(1)switch(_ctx4.prev = _ctx4.next){
                            case 0:
                                _superprop_get("x").call(_this4);
                                a = _superprop_get("x");
                                // element access in arrow
                                (function() {
                                    return _superprop_get("x").call(_this4);
                                });
                                // element access in async arrow
                                _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
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
            value: function element_access_only_write_only() {
                var _this = this;
                var _superprop_get = function(_prop) {
                    return _get(_getPrototypeOf(B.prototype), _prop, _this);
                }, // element access (assign)
                _superprop_set = function(_prop, _value) {
                    return _set(_getPrototypeOf(B.prototype), _prop, _value, _this, true);
                };
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                    var f, ref;
                    return regeneratorRuntime.wrap(function _callee$(_ctx5) {
                        while(1)switch(_ctx5.prev = _ctx5.next){
                            case 0:
                                f = function() {};
                                _superprop_set("x", f);
                                ;
                                // destructuring assign with element access
                                (ref = {
                                    f: f
                                }, _superprop_get("x") = ref.f, ref);
                                // element access (assign) in arrow
                                (function() {
                                    return _superprop_set("x", f);
                                });
                                // element access (assign) in async arrow
                                _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
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
            value: function property_access_only_read_only_in_generator() {
                var _this = this;
                var _this5 = this, // call with property access
                _superprop_get_x = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this);
                };
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee6() {
                    var a;
                    return regeneratorRuntime.wrap(function _callee$(_ctx6) {
                        while(1)switch(_ctx6.prev = _ctx6.next){
                            case 0:
                                _superprop_get_x().call(_this5);
                                a = _superprop_get_x();
                                // property access in arrow
                                (function() {
                                    return _superprop_get_x().call(_this5);
                                });
                                // property access in async arrow
                                _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
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
            value: function property_access_only_write_only_in_generator() {
                var _this = this;
                var _superprop_get_x = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this);
                }, _superprop_set_x = function(_value) {
                    return _set(_getPrototypeOf(B.prototype), "x", _value, _this, true);
                };
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee7() {
                    var f, ref;
                    return regeneratorRuntime.wrap(function _callee$(_ctx7) {
                        while(1)switch(_ctx7.prev = _ctx7.next){
                            case 0:
                                f = function() {};
                                // property access (assign)
                                _superprop_set_x(f);
                                ;
                                // destructuring assign with property access
                                (ref = {
                                    f: f
                                }, _superprop_get_x() = ref.f, ref);
                                // property access (assign) in arrow
                                (function() {
                                    return _superprop_set_x(f);
                                });
                                // property access (assign) in async arrow
                                _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
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
            value: function element_access_only_read_only_in_generator() {
                var _this = this;
                var _this6 = this, // call with element access
                _superprop_get = function(_prop) {
                    return _get(_getPrototypeOf(B.prototype), _prop, _this);
                };
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee8() {
                    var a;
                    return regeneratorRuntime.wrap(function _callee$(_ctx8) {
                        while(1)switch(_ctx8.prev = _ctx8.next){
                            case 0:
                                _superprop_get("x").call(_this6);
                                a = _superprop_get("x");
                                // element access in arrow
                                (function() {
                                    return _superprop_get("x").call(_this6);
                                });
                                // element access in async arrow
                                _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
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
            value: function element_access_only_write_only_in_generator() {
                var _this = this;
                var _superprop_get = function(_prop) {
                    return _get(_getPrototypeOf(B.prototype), _prop, _this);
                }, // element access (assign)
                _superprop_set = function(_prop, _value) {
                    return _set(_getPrototypeOf(B.prototype), _prop, _value, _this, true);
                };
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee9() {
                    var f, ref;
                    return regeneratorRuntime.wrap(function _callee$(_ctx9) {
                        while(1)switch(_ctx9.prev = _ctx9.next){
                            case 0:
                                f = function() {};
                                _superprop_set("x", f);
                                ;
                                // destructuring assign with element access
                                (ref = {
                                    f: f
                                }, _superprop_get("x") = ref.f, ref);
                                // element access (assign) in arrow
                                (function() {
                                    return _superprop_set("x", f);
                                });
                                // element access (assign) in async arrow
                                _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
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
    ]);
    return B;
}(A);
