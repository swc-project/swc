import regeneratorRuntime from "regenerator-runtime";
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++){
            arr2[i] = arr[i];
        }
        return arr2;
    }
}
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
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
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
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
var _typeof = function(obj) {
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
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
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
            value: function x() {
            }
        },
        {
            key: "y",
            value: function y() {
            }
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
                var _this = this, _this1 = this, _this2 = this, _this3 = this, _this4 = this;
                var // call with property access
                _instance, // call additional property.
                _instance1, // call with element access
                _instance2;
                var _super_x = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance = _get(_getPrototypeOf(B.prototype), "x", _this)).call.apply(_instance, [
                        _this
                    ].concat(_toConsumableArray(_args)));
                }, _super_y = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance1 = _get(_getPrototypeOf(B.prototype), "y", _this1)).call.apply(_instance1, [
                        _this1
                    ].concat(_toConsumableArray(_args)));
                }, _super_method = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance2 = _get(_getPrototypeOf(B.prototype), "x", _this2)).call.apply(_instance2, [
                        _this2
                    ].concat(_toConsumableArray(_args)));
                }, _super_x1 = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this3);
                }, _super_method1 = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this4);
                };
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    var a, b;
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _super_x();
                                _super_y();
                                _super_method();
                                a = _super_x1();
                                b = _super_method1();
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
                var _this = this, _this5 = this, _this6 = this, _this7 = this, _this8 = this, _this9 = this, _this10 = this, _this11 = this, _this12 = this, _this13 = this, _this14 = this, _this15 = this;
                var // call with property access
                _instance, // call with element access
                _instance3, _instance4, _instance5, _instance6, _instance7;
                var _super_x = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance = _get(_getPrototypeOf(B.prototype), "x", _this)).call.apply(_instance, [
                        _this
                    ].concat(_toConsumableArray(_args)));
                }, _super_method = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance3 = _get(_getPrototypeOf(B.prototype), "x", _this5)).call.apply(_instance3, [
                        _this5
                    ].concat(_toConsumableArray(_args)));
                }, _super_x2 = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this6);
                }, _super_method2 = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this7);
                }, _super_x3 = function(_args) {
                    // property access (assign)
                    return _set(_getPrototypeOf(B.prototype), "x", _args, _this8, true);
                }, _super_method3 = function(_args) {
                    // element access (assign)
                    return _set(_getPrototypeOf(B.prototype), "x", _args, _this9, true);
                }, _super_x4 = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this10);
                }, _super_method4 = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this11);
                }, _super_x5 = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance4 = _get(_getPrototypeOf(B.prototype), "x", _this12)).call.apply(_instance4, [
                        _this12
                    ].concat(_toConsumableArray(_args)));
                }, _super_method5 = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance5 = _get(_getPrototypeOf(B.prototype), "x", _this13)).call.apply(_instance5, [
                        _this13
                    ].concat(_toConsumableArray(_args)));
                }, _super_x6 = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance6 = _get(_getPrototypeOf(B.prototype), "x", _this14)).call.apply(_instance6, [
                        _this14
                    ].concat(_toConsumableArray(_args)));
                }, _super_method6 = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance7 = _get(_getPrototypeOf(B.prototype), "x", _this15)).call.apply(_instance7, [
                        _this15
                    ].concat(_toConsumableArray(_args)));
                };
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee1() {
                    var f, a, b, ref, ref1;
                    return regeneratorRuntime.wrap(function _callee$(_ctx1) {
                        while(1)switch(_ctx1.prev = _ctx1.next){
                            case 0:
                                f = function() {
                                };
                                _super_x();
                                _super_method();
                                a = _super_x2();
                                b = _super_method2();
                                _super_x3(f);
                                _super_method3(f);
                                ;
                                // destructuring assign with property access
                                (ref = {
                                    f: f
                                }, _super_x4() = ref.f, ref);
                                ;
                                // destructuring assign with element access
                                (ref1 = {
                                    f: f
                                }, _super_method4() = ref1.f, ref1);
                                // property access in arrow
                                (function() {
                                    return _super_x5();
                                });
                                // element access in arrow
                                (function() {
                                    return _super_method5();
                                });
                                // property access in async arrow
                                _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
                                            case 0:
                                                return _ctx.abrupt("return", _super_x6());
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
                                                return _ctx.abrupt("return", _super_method6());
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
                var _this = this, _this16 = this, _this17 = this, _this18 = this;
                var // call with property access
                _instance, _instance8, _instance9;
                var _super_x = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance = _get(_getPrototypeOf(B.prototype), "x", _this)).call.apply(_instance, [
                        _this
                    ].concat(_toConsumableArray(_args)));
                }, _super_x7 = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this16);
                }, _super_x8 = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance8 = _get(_getPrototypeOf(B.prototype), "x", _this17)).call.apply(_instance8, [
                        _this17
                    ].concat(_toConsumableArray(_args)));
                }, _super_x9 = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance9 = _get(_getPrototypeOf(B.prototype), "x", _this18)).call.apply(_instance9, [
                        _this18
                    ].concat(_toConsumableArray(_args)));
                };
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                    var a;
                    return regeneratorRuntime.wrap(function _callee$(_ctx2) {
                        while(1)switch(_ctx2.prev = _ctx2.next){
                            case 0:
                                _super_x();
                                a = _super_x7();
                                // property access in arrow
                                (function() {
                                    return _super_x8();
                                });
                                // property access in async arrow
                                _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
                                            case 0:
                                                return _ctx.abrupt("return", _super_x9());
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
                var _this = this, _this19 = this, _this20 = this, _this21 = this;
                var _super_x = function(_args) {
                    // property access (assign)
                    return _set(_getPrototypeOf(B.prototype), "x", _args, _this, true);
                }, _super_x10 = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this19);
                }, _super_x11 = function(_args) {
                    return _set(_getPrototypeOf(B.prototype), "x", _args, _this20, true);
                }, _super_x12 = function(_args) {
                    return _set(_getPrototypeOf(B.prototype), "x", _args, _this21, true);
                };
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                    var f, ref;
                    return regeneratorRuntime.wrap(function _callee$(_ctx3) {
                        while(1)switch(_ctx3.prev = _ctx3.next){
                            case 0:
                                f = function() {
                                };
                                _super_x(f);
                                ;
                                // destructuring assign with property access
                                (ref = {
                                    f: f
                                }, _super_x10() = ref.f, ref);
                                // property access (assign) in arrow
                                (function() {
                                    return _super_x11(f);
                                });
                                // property access (assign) in async arrow
                                _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
                                            case 0:
                                                return _ctx.abrupt("return", _super_x12(f));
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
                var _this = this, _this22 = this, _this23 = this, _this24 = this;
                var // call with element access
                _instance, _instance10, _instance11;
                var _super_method = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance = _get(_getPrototypeOf(B.prototype), "x", _this)).call.apply(_instance, [
                        _this
                    ].concat(_toConsumableArray(_args)));
                }, _super_method7 = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this22);
                }, _super_method8 = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance10 = _get(_getPrototypeOf(B.prototype), "x", _this23)).call.apply(_instance10, [
                        _this23
                    ].concat(_toConsumableArray(_args)));
                }, _super_method9 = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance11 = _get(_getPrototypeOf(B.prototype), "x", _this24)).call.apply(_instance11, [
                        _this24
                    ].concat(_toConsumableArray(_args)));
                };
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                    var a;
                    return regeneratorRuntime.wrap(function _callee$(_ctx4) {
                        while(1)switch(_ctx4.prev = _ctx4.next){
                            case 0:
                                _super_method();
                                a = _super_method7();
                                // element access in arrow
                                (function() {
                                    return _super_method8();
                                });
                                // element access in async arrow
                                _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
                                            case 0:
                                                return _ctx.abrupt("return", _super_method9());
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
                var _this = this, _this25 = this, _this26 = this, _this27 = this;
                var _super_method = function(_args) {
                    // element access (assign)
                    return _set(_getPrototypeOf(B.prototype), "x", _args, _this, true);
                }, _super_method10 = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this25);
                }, _super_method11 = function(_args) {
                    return _set(_getPrototypeOf(B.prototype), "x", _args, _this26, true);
                }, _super_method12 = function(_args) {
                    return _set(_getPrototypeOf(B.prototype), "x", _args, _this27, true);
                };
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                    var f, ref;
                    return regeneratorRuntime.wrap(function _callee$(_ctx5) {
                        while(1)switch(_ctx5.prev = _ctx5.next){
                            case 0:
                                f = function() {
                                };
                                _super_method(f);
                                ;
                                // destructuring assign with element access
                                (ref = {
                                    f: f
                                }, _super_method10() = ref.f, ref);
                                // element access (assign) in arrow
                                (function() {
                                    return _super_method11(f);
                                });
                                // element access (assign) in async arrow
                                _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
                                            case 0:
                                                return _ctx.abrupt("return", _super_method12(f));
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
                var _this = this, _this28 = this, _this29 = this, _this30 = this;
                var // call with property access
                _instance, _instance12, _instance13;
                var _super_x = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance = _get(_getPrototypeOf(B.prototype), "x", _this)).call.apply(_instance, [
                        _this
                    ].concat(_toConsumableArray(_args)));
                }, _super_x13 = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this28);
                }, _super_x14 = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance12 = _get(_getPrototypeOf(B.prototype), "x", _this29)).call.apply(_instance12, [
                        _this29
                    ].concat(_toConsumableArray(_args)));
                }, _super_x15 = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance13 = _get(_getPrototypeOf(B.prototype), "x", _this30)).call.apply(_instance13, [
                        _this30
                    ].concat(_toConsumableArray(_args)));
                };
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee6() {
                    var a;
                    return regeneratorRuntime.wrap(function _callee$(_ctx6) {
                        while(1)switch(_ctx6.prev = _ctx6.next){
                            case 0:
                                _super_x();
                                a = _super_x13();
                                // property access in arrow
                                (function() {
                                    return _super_x14();
                                });
                                // property access in async arrow
                                _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
                                            case 0:
                                                return _ctx.abrupt("return", _super_x15());
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
                var _this = this, _this31 = this, _this32 = this, _this33 = this;
                var _super_x = function(_args) {
                    // property access (assign)
                    return _set(_getPrototypeOf(B.prototype), "x", _args, _this, true);
                }, _super_x16 = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this31);
                }, _super_x17 = function(_args) {
                    return _set(_getPrototypeOf(B.prototype), "x", _args, _this32, true);
                }, _super_x18 = function(_args) {
                    return _set(_getPrototypeOf(B.prototype), "x", _args, _this33, true);
                };
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee7() {
                    var f, ref;
                    return regeneratorRuntime.wrap(function _callee$(_ctx7) {
                        while(1)switch(_ctx7.prev = _ctx7.next){
                            case 0:
                                f = function() {
                                };
                                _super_x(f);
                                ;
                                // destructuring assign with property access
                                (ref = {
                                    f: f
                                }, _super_x16() = ref.f, ref);
                                // property access (assign) in arrow
                                (function() {
                                    return _super_x17(f);
                                });
                                // property access (assign) in async arrow
                                _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
                                            case 0:
                                                return _ctx.abrupt("return", _super_x18(f));
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
                var _this = this, _this34 = this, _this35 = this, _this36 = this;
                var // call with element access
                _instance, _instance14, _instance15;
                var _super_method = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance = _get(_getPrototypeOf(B.prototype), "x", _this)).call.apply(_instance, [
                        _this
                    ].concat(_toConsumableArray(_args)));
                }, _super_method13 = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this34);
                }, _super_method14 = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance14 = _get(_getPrototypeOf(B.prototype), "x", _this35)).call.apply(_instance14, [
                        _this35
                    ].concat(_toConsumableArray(_args)));
                }, _super_method15 = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance15 = _get(_getPrototypeOf(B.prototype), "x", _this36)).call.apply(_instance15, [
                        _this36
                    ].concat(_toConsumableArray(_args)));
                };
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee8() {
                    var a;
                    return regeneratorRuntime.wrap(function _callee$(_ctx8) {
                        while(1)switch(_ctx8.prev = _ctx8.next){
                            case 0:
                                _super_method();
                                a = _super_method13();
                                // element access in arrow
                                (function() {
                                    return _super_method14();
                                });
                                // element access in async arrow
                                _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
                                            case 0:
                                                return _ctx.abrupt("return", _super_method15());
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
                var _this = this, _this37 = this, _this38 = this, _this39 = this;
                var _super_method = function(_args) {
                    // element access (assign)
                    return _set(_getPrototypeOf(B.prototype), "x", _args, _this, true);
                }, _super_method16 = function() {
                    return _get(_getPrototypeOf(B.prototype), "x", _this37);
                }, _super_method17 = function(_args) {
                    return _set(_getPrototypeOf(B.prototype), "x", _args, _this38, true);
                }, _super_method18 = function(_args) {
                    return _set(_getPrototypeOf(B.prototype), "x", _args, _this39, true);
                };
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee9() {
                    var f, ref;
                    return regeneratorRuntime.wrap(function _callee$(_ctx9) {
                        while(1)switch(_ctx9.prev = _ctx9.next){
                            case 0:
                                f = function() {
                                };
                                _super_method(f);
                                ;
                                // destructuring assign with element access
                                (ref = {
                                    f: f
                                }, _super_method16() = ref.f, ref);
                                // element access (assign) in arrow
                                (function() {
                                    return _super_method17(f);
                                });
                                // element access (assign) in async arrow
                                _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
                                            case 0:
                                                return _ctx.abrupt("return", _super_method18(f));
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
