import regeneratorRuntime from "regenerator-runtime";
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
function _awaitAsyncGenerator(value) {
    return new _AwaitValue(value);
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
var C1 = function() {
    "use strict";
    function C1() {
        _classCallCheck(this, C1);
    }
    return _createClass(C1, [
        {
            key: "f",
            value: function() {
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
                            case 0:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        }
    ]), C1;
}(), C2 = function() {
    "use strict";
    function C2() {
        _classCallCheck(this, C2);
    }
    return _createClass(C2, [
        {
            key: "f",
            value: function() {
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    var x;
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
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
    ]), C2;
}(), C3 = function() {
    "use strict";
    function C3() {
        _classCallCheck(this, C3);
    }
    return _createClass(C3, [
        {
            key: "f",
            value: function() {
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    var x;
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
                            case 0:
                                return _ctx.next = 2, 1;
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
    ]), C3;
}(), C4 = function() {
    "use strict";
    function C4() {
        _classCallCheck(this, C4);
    }
    return _createClass(C4, [
        {
            key: "f",
            value: function() {
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    var x;
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
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
    ]), C4;
}(), C5 = function() {
    "use strict";
    function C5() {
        _classCallCheck(this, C5);
    }
    return _createClass(C5, [
        {
            key: "f",
            value: function() {
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee1() {
                    var x;
                    return regeneratorRuntime.wrap(function(_ctx1) {
                        for(;;)switch(_ctx1.prev = _ctx1.next){
                            case 0:
                                return _ctx1.delegateYield(_wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function(_ctx) {
                                        for(;;)switch(_ctx.prev = _ctx.next){
                                            case 0:
                                                return _ctx.next = 2, 1;
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
    ]), C5;
}(), C6 = function() {
    "use strict";
    function C6() {
        _classCallCheck(this, C6);
    }
    return _createClass(C6, [
        {
            key: "f",
            value: function() {
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    var x;
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
                            case 0:
                                return _ctx.next = 2, _awaitAsyncGenerator(1);
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
    ]), C6;
}(), C7 = function() {
    "use strict";
    function C7() {
        _classCallCheck(this, C7);
    }
    return _createClass(C7, [
        {
            key: "f",
            value: function() {
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
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
    ]), C7;
}(), C8 = function() {
    "use strict";
    function C8() {
        _classCallCheck(this, C8);
    }
    return _createClass(C8, [
        {
            key: "g",
            value: function() {
            }
        },
        {
            key: "f",
            value: function() {
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
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
    ]), C8;
}(), B9 = function() {
    "use strict";
    function B9() {
        _classCallCheck(this, B9);
    }
    return _createClass(B9, [
        {
            key: "g",
            value: function() {
            }
        }
    ]), B9;
}(), C9 = function(B9) {
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
    }(C9, B9);
    var _super = function(Derived) {
        var hasNativeReflectConstruct = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ("function" == typeof Proxy) return !0;
            try {
                return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
                })), !0;
            } catch (e) {
                return !1;
            }
        }();
        return function() {
            var obj, self, call, result, Super = _getPrototypeOf(Derived);
            if (hasNativeReflectConstruct) {
                var NewTarget = _getPrototypeOf(this).constructor;
                result = Reflect.construct(Super, arguments, NewTarget);
            } else result = Super.apply(this, arguments);
            return self = this, (call = result) && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : (function(self) {
                if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return self;
            })(self);
        };
    }(C9);
    function C9() {
        return _classCallCheck(this, C9), _super.apply(this, arguments);
    }
    return _createClass(C9, [
        {
            key: "f",
            value: function() {
                var _instance, _this = this, _super_g = function() {
                    for(var arr, _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++)_args[_key] = arguments[_key];
                    return (_instance = _get(_getPrototypeOf(C9.prototype), "g", _this)).call.apply(_instance, [
                        _this
                    ].concat(function(arr) {
                        if (Array.isArray(arr)) {
                            for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)arr2[i] = arr[i];
                            return arr2;
                        }
                    }(arr = _args) || function(iter) {
                        if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
                    }(arr) || function() {
                        throw new TypeError("Invalid attempt to spread non-iterable instance");
                    }()));
                };
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
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
    ]), C9;
}(B9);
