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
var A = // @target: es6
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
    var _super1 = _createSuper(B);
    function B() {
        _classCallCheck(this, B);
        return _super1.apply(this, arguments);
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
                    var _super, _superIndex, a, b;
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _super = null;
                                _superIndex = null;
                                _super_x();
                                _super_y();
                                _super_method();
                                a = _super_x1();
                                b = _super_method1();
                            case 7:
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
                var _this = this, _this5 = this, _this6 = this, _this7 = this, _this8 = this, _this9 = this, _this10 = this, _this11 = this;
                var // call with property access
                _instance, // call with element access
                _instance3;
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
                };
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    var _super, _superIndex, f, a, b, ref, ref1;
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _super = null;
                                _superIndex = null;
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
                            case 13:
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
