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
function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
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
var _obj, _marked = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, constCall;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}), _marked1 = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, varCall;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked1);
}), _marked2 = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, letCall;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked2);
}), _marked3 = regeneratorRuntime.mark(function() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, constCall;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked3);
}), constCall = Symbol(), letCall = Symbol(), varCall = Symbol();
function _asyncFuncReturnConstCall() {
    return (_asyncFuncReturnConstCall = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", constCall);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _asyncFuncReturnLetCall() {
    return (_asyncFuncReturnLetCall = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", letCall);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _asyncFuncReturnVarCall() {
    return (_asyncFuncReturnVarCall = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", varCall);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _asyncGenFuncYieldConstCall() {
    return (_asyncGenFuncYieldConstCall = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.next = 2, constCall;
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _asyncGenFuncYieldLetCall() {
    return (_asyncGenFuncYieldLetCall = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.next = 2, letCall;
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
function _asyncGenFuncYieldVarCall() {
    return (_asyncGenFuncYieldVarCall = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.next = 2, varCall;
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
Symbol();
var C = function() {
    "use strict";
    _classCallCheck(this, C), this.readonlyCall = Symbol(), this.readwriteCall = Symbol();
};
C.readonlyStaticCall = Symbol(), C.readonlyStaticTypeAndCall = Symbol(), C.readwriteStaticCall = Symbol(), C.readonlyStaticCall, C.readonlyStaticType, C.readonlyStaticTypeAndCall, C.readwriteStaticCall, C.readonlyStaticCall, C.readonlyStaticType, C.readonlyStaticTypeAndCall, C.readwriteStaticCall, l.nested.readonlyNestedType, l.nested.readonlyNestedType, l.nested.readonlyNestedType, Promise.resolve(constCall), f(s), f(N.s), f(N.s), regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, s;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
});
var C0 = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C0() {
        _classCallCheck(this, C0), this.a = s, this.b = N.s, this.c = N.s, this.d = s, this.e = N.s, this.f = N.s;
    }
    return Constructor = C0, protoProps = [
        {
            key: "method1",
            value: function() {
                return s;
            }
        },
        {
            key: "method2",
            value: function() {
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
                            case 0:
                                return _ctx.abrupt("return", s);
                            case 1:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        },
        {
            key: "method3",
            value: function() {
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
                            case 0:
                                return _ctx.next = 2, s;
                            case 2:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        },
        {
            key: "method4",
            value: regeneratorRuntime.mark(function method4() {
                return regeneratorRuntime.wrap(function(_ctx) {
                    for(;;)switch(_ctx.prev = _ctx.next){
                        case 0:
                            return _ctx.next = 2, s;
                        case 2:
                        case "end":
                            return _ctx.stop();
                    }
                }, method4);
            })
        },
        {
            key: "method5",
            value: function(param) {
                return void 0 === param ? s : param;
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C0;
}();
C0.a = s, C0.b = N.s, C0.c = N.s, C0.d = s, C0.e = N.s, C0.f = N.s, o[s], o[N.s], o[N.s], f(s), f(N.s), f(N.s), g(s), g(N.s), g(N.s), _defineProperty(_obj = {
}, s, "a"), _defineProperty(_obj, N.s, "b");
var C1 = function() {
    "use strict";
    _classCallCheck(this, C1);
};
regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, s;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
});
