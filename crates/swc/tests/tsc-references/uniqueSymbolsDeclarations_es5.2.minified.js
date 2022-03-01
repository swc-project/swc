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
Symbol(), constType, constType, constType, constType;
var C = function() {
    "use strict";
    _classCallCheck(this, C), this.readonlyCall = Symbol(), this.readwriteCall = Symbol();
};
C.readonlyStaticCall = Symbol(), C.readonlyStaticTypeAndCall = Symbol(), C.readwriteStaticCall = Symbol(), C.readonlyStaticCall, C.readonlyStaticType, C.readonlyStaticTypeAndCall, C.readwriteStaticCall, C.readonlyStaticCall, C.readonlyStaticType, C.readonlyStaticTypeAndCall, C.readwriteStaticCall, c.readonlyCall, c.readwriteCall, c.readonlyCall, c.readwriteCall, c.readonlyCall, c.readwriteCall, i.readonlyType, i.readonlyType, i.readonlyType, l.readonlyType, l.nested.readonlyNestedType, l.readonlyType, l.nested.readonlyNestedType, l.readonlyType, l.nested.readonlyNestedType, Promise.resolve(constCall), f(s), f(N.s), f(N.s), N.s, N.s, s, N.s, N.s, regeneratorRuntime.mark(function method4() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, s;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, method4);
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
                var fn;
                return (fn = regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
                            case 0:
                                return _ctx.abrupt("return", s);
                            case 1:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }), function() {
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
                })();
            }
        },
        {
            key: "method3",
            value: function() {
                var fn;
                return (fn = regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function(_ctx) {
                        for(;;)switch(_ctx.prev = _ctx.next){
                            case 0:
                                return _ctx.next = 2, s;
                            case 2:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }), function() {
                    return new AsyncGenerator(fn.apply(this, arguments));
                })();
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
            value: function() {
                var p = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : s;
                return p;
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C0;
}();
C0.a = s, C0.b = N.s, C0.c = N.s, C0.d = s, C0.e = N.s, C0.f = N.s, o[s], o[N.s], o[N.s], f(s), f(N.s), f(N.s), g(s), g(N.s), g(N.s), s, N.s, N.s, 2 * Math.random() && N.s, 2 * Math.random() && N.s, _defineProperty(_obj = {}, s, "a"), _defineProperty(_obj, N.s, "b");
var C1 = function() {
    "use strict";
    _classCallCheck(this, C1);
};
regeneratorRuntime.mark(function method4() {
    return regeneratorRuntime.wrap(function(_ctx) {
        for(;;)switch(_ctx.prev = _ctx.next){
            case 0:
                return _ctx.next = 2, s;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, method4);
});
