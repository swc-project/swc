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
function _awaitAsyncGenerator(value) {
    return new _AwaitValue(value);
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
var C1 = // @target: es2018
// @lib: esnext
// @filename: C1.ts
/*#__PURE__*/ function() {
    "use strict";
    function C1() {
        _classCallCheck(this, C1);
    }
    _createClass(C1, [
        {
            key: "f",
            value: function f() {
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        }
    ]);
    return C1;
}();
var C2 = // @filename: C2.ts
/*#__PURE__*/ function() {
    "use strict";
    function C2() {
        _classCallCheck(this, C2);
    }
    _createClass(C2, [
        {
            key: "f",
            value: function f() {
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    var x;
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _ctx.next = 2;
                                return;
                            case 2:
                                x = _ctx.sent;
                            case 3:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        }
    ]);
    return C2;
}();
var C3 = // @filename: C3.ts
/*#__PURE__*/ function() {
    "use strict";
    function C3() {
        _classCallCheck(this, C3);
    }
    _createClass(C3, [
        {
            key: "f",
            value: function f() {
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    var x;
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _ctx.next = 2;
                                return 1;
                            case 2:
                                x = _ctx.sent;
                            case 3:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        }
    ]);
    return C3;
}();
var C4 = // @filename: C4.ts
/*#__PURE__*/ function() {
    "use strict";
    function C4() {
        _classCallCheck(this, C4);
    }
    _createClass(C4, [
        {
            key: "f",
            value: function f() {
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    var x;
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                return _ctx.delegateYield([
                                    1
                                ], "t0", 1);
                            case 1:
                                x = _ctx.t0;
                            case 2:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        }
    ]);
    return C4;
}();
var C5 = // @filename: C5.ts
/*#__PURE__*/ function() {
    "use strict";
    function C5() {
        _classCallCheck(this, C5);
    }
    _createClass(C5, [
        {
            key: "f",
            value: function f() {
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee1() {
                    var x;
                    return regeneratorRuntime.wrap(function _callee$(_ctx1) {
                        while(1)switch(_ctx1.prev = _ctx1.next){
                            case 0:
                                return _ctx1.delegateYield(_wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                        while(1)switch(_ctx.prev = _ctx.next){
                                            case 0:
                                                _ctx.next = 2;
                                                return 1;
                                            case 2:
                                            case "end":
                                                return _ctx.stop();
                                        }
                                    }, _callee);
                                }))(), "t0", 1);
                            case 1:
                                x = _ctx1.t0;
                            case 2:
                            case "end":
                                return _ctx1.stop();
                        }
                    }, _callee1);
                }))();
            }
        }
    ]);
    return C5;
}();
var C6 = // @filename: C6.ts
/*#__PURE__*/ function() {
    "use strict";
    function C6() {
        _classCallCheck(this, C6);
    }
    _createClass(C6, [
        {
            key: "f",
            value: function f() {
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    var x;
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _ctx.next = 2;
                                return _awaitAsyncGenerator(1);
                            case 2:
                                x = _ctx.sent;
                            case 3:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        }
    ]);
    return C6;
}();
var C7 = // @filename: C7.ts
/*#__PURE__*/ function() {
    "use strict";
    function C7() {
        _classCallCheck(this, C7);
    }
    _createClass(C7, [
        {
            key: "f",
            value: function f() {
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                return _ctx.abrupt("return", 1);
                            case 1:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        }
    ]);
    return C7;
}();
var C8 = // @filename: C8.ts
/*#__PURE__*/ function() {
    "use strict";
    function C8() {
        _classCallCheck(this, C8);
    }
    _createClass(C8, [
        {
            key: "g",
            value: function g() {
            }
        },
        {
            key: "f",
            value: function f() {
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                this.g();
                            case 1:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee, this);
                }).bind(this))();
            }
        }
    ]);
    return C8;
}();
var B9 = // @filename: C9.ts
/*#__PURE__*/ function() {
    "use strict";
    function B9() {
        _classCallCheck(this, B9);
    }
    _createClass(B9, [
        {
            key: "g",
            value: function g() {
            }
        }
    ]);
    return B9;
}();
var C9 = /*#__PURE__*/ function(B9) {
    "use strict";
    _inherits(C9, B9);
    var _super = _createSuper(C9);
    function C9() {
        _classCallCheck(this, C9);
        return _super.apply(this, arguments);
    }
    _createClass(C9, [
        {
            key: "f",
            value: function f() {
                var _this = this;
                var _instance;
                var _super_g = function() {
                    for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
                        _args[_key] = arguments[_key];
                    }
                    return (_instance = _get(_getPrototypeOf(C9.prototype), "g", _this)).call.apply(_instance, [
                        _this
                    ].concat(_toConsumableArray(_args)));
                };
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _super_g();
                            case 1:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        }
    ]);
    return C9;
}(B9);
