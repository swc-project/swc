import regeneratorRuntime from "regenerator-runtime";
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
function _wrapAsyncGenerator(fn) {
    return function() {
        return new AsyncGenerator(fn.apply(this, arguments));
    };
}
var _marked = regeneratorRuntime.mark(genFuncYieldConstCallWithTypeQuery);
var _marked1 = regeneratorRuntime.mark(genFuncYieldVarCall);
var _marked2 = regeneratorRuntime.mark(genFuncYieldLetCall);
var _marked3 = regeneratorRuntime.mark(genFuncYieldConstCall);
// @target: esnext
// @lib: esnext
// @declaration: false
// declarations with call initializer
var constCall = Symbol();
var letCall = Symbol();
var varCall = Symbol();
// declaration with type and call initializer
var constTypeAndCall = Symbol();
// declaration from initializer
var constInitToConstCall = constCall;
var constInitToLetCall = letCall;
var constInitToVarCall = varCall;
var constInitToConstDeclAmbient = constType;
var letInitToConstCall = constCall;
var letInitToLetCall = letCall;
var letInitToVarCall = varCall;
var letInitToConstDeclAmbient = constType;
var varInitToConstCall = constCall;
var varInitToLetCall = letCall;
var varInitToVarCall = varCall;
var varInitToConstDeclAmbient = constType;
// declaration from initializer with type query
var constInitToConstCallWithTypeQuery = constCall;
var constInitToConstDeclAmbientWithTypeQuery = constType;
// assignment from any
// https://github.com/Microsoft/TypeScript/issues/29108
var fromAny = {
};
// function return inference
function funcReturnConstCall() {
    return constCall;
}
function funcReturnLetCall() {
    return letCall;
}
function funcReturnVarCall() {
    return varCall;
}
// function return value with type query
function funcReturnConstCallWithTypeQuery() {
    return constCall;
}
// generator function yield inference
function genFuncYieldConstCall() {
    return regeneratorRuntime.wrap(function genFuncYieldConstCall$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return constCall;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked3);
}
function genFuncYieldLetCall() {
    return regeneratorRuntime.wrap(function genFuncYieldLetCall$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return letCall;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked2);
}
function genFuncYieldVarCall() {
    return regeneratorRuntime.wrap(function genFuncYieldVarCall$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return varCall;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked1);
}
// generator function yield with return type query
function genFuncYieldConstCallWithTypeQuery() {
    return regeneratorRuntime.wrap(function genFuncYieldConstCallWithTypeQuery$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.next = 2;
                return constCall;
            case 2:
            case "end":
                return _ctx.stop();
        }
    }, _marked);
}
function asyncFuncReturnConstCall() {
    return _asyncFuncReturnConstCall.apply(this, arguments);
}
function _asyncFuncReturnConstCall() {
    _asyncFuncReturnConstCall = // async function return inference
    _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", constCall);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _asyncFuncReturnConstCall.apply(this, arguments);
}
function asyncFuncReturnLetCall() {
    return _asyncFuncReturnLetCall.apply(this, arguments);
}
function _asyncFuncReturnLetCall() {
    _asyncFuncReturnLetCall = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", letCall);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _asyncFuncReturnLetCall.apply(this, arguments);
}
function asyncFuncReturnVarCall() {
    return _asyncFuncReturnVarCall.apply(this, arguments);
}
function _asyncFuncReturnVarCall() {
    _asyncFuncReturnVarCall = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", varCall);
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _asyncFuncReturnVarCall.apply(this, arguments);
}
function asyncGenFuncYieldConstCall() {
    return _asyncGenFuncYieldConstCall.apply(this, arguments);
}
function _asyncGenFuncYieldConstCall() {
    _asyncGenFuncYieldConstCall = // async generator function yield inference
    _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return constCall;
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _asyncGenFuncYieldConstCall.apply(this, arguments);
}
function asyncGenFuncYieldLetCall() {
    return _asyncGenFuncYieldLetCall.apply(this, arguments);
}
function _asyncGenFuncYieldLetCall() {
    _asyncGenFuncYieldLetCall = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return letCall;
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _asyncGenFuncYieldLetCall.apply(this, arguments);
}
function asyncGenFuncYieldVarCall() {
    return _asyncGenFuncYieldVarCall.apply(this, arguments);
}
function _asyncGenFuncYieldVarCall() {
    _asyncGenFuncYieldVarCall = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return varCall;
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _asyncGenFuncYieldVarCall.apply(this, arguments);
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
    // classes
    this.readonlyCall = Symbol();
    this.readwriteCall = Symbol();
};
C.readonlyStaticCall = Symbol();
C.readonlyStaticTypeAndCall = Symbol();
C.readwriteStaticCall = Symbol();
var constInitToCReadonlyStaticCall = C.readonlyStaticCall;
var constInitToCReadonlyStaticType = C.readonlyStaticType;
var constInitToCReadonlyStaticTypeAndCall = C.readonlyStaticTypeAndCall;
var constInitToCReadwriteStaticCall = C.readwriteStaticCall;
var constInitToCReadonlyStaticCallWithTypeQuery = C.readonlyStaticCall;
var constInitToCReadonlyStaticTypeWithTypeQuery = C.readonlyStaticType;
var constInitToCReadonlyStaticTypeAndCallWithTypeQuery = C.readonlyStaticTypeAndCall;
var constInitToCReadwriteStaticCallWithTypeQuery = C.readwriteStaticCall;
var constInitToCReadonlyCall = c.readonlyCall;
var constInitToCReadwriteCall = c.readwriteCall;
var constInitToCReadonlyCallWithTypeQuery = c.readonlyCall;
var constInitToCReadwriteCallWithTypeQuery = c.readwriteCall;
var constInitToCReadonlyCallWithIndexedAccess = c.readonlyCall;
var constInitToCReadwriteCallWithIndexedAccess = c.readwriteCall;
var constInitToIReadonlyType = i.readonlyType;
var constInitToIReadonlyTypeWithTypeQuery = i.readonlyType;
var constInitToIReadonlyTypeWithIndexedAccess = i.readonlyType;
var constInitToLReadonlyType = l.readonlyType;
var constInitToLReadonlyNestedType = l.nested.readonlyNestedType;
var constInitToLReadonlyTypeWithTypeQuery = l.readonlyType;
var constInitToLReadonlyNestedTypeWithTypeQuery = l.nested.readonlyNestedType;
var constInitToLReadonlyTypeWithIndexedAccess = l.readonlyType;
var constInitToLReadonlyNestedTypeWithIndexedAccess = l.nested.readonlyNestedType;
// type argument inference
var promiseForConstCall = Promise.resolve(constCall);
var arrayOfConstCall = [
    constCall
];
// widening positions
// argument inference
f(s);
f(N.s);
f(N["s"]);
// array literal elements
[
    s
];
[
    N.s
];
[
    N["s"]
];
// property assignments/methods
var o2 = {
    a: s,
    b: N.s,
    c: N["s"],
    method1: function() {
        return s;
    },
    method2: function() {
        return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.abrupt("return", s);
                    case 1:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    },
    method3: function() {
        return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return s;
                    case 2:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    },
    method4: regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return s;
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }),
    method5: function(param) {
        var p = param === void 0 ? s : param;
        return p;
    }
};
var C0 = // property initializers
/*#__PURE__*/ function() {
    "use strict";
    function C0() {
        _classCallCheck(this, C0);
        this.a = s;
        this.b = N.s;
        this.c = N["s"];
        this.d = s;
        this.e = N.s;
        this.f = N["s"];
    }
    _createClass(C0, [
        {
            key: "method1",
            value: function method1() {
                return s;
            }
        },
        {
            key: "method2",
            value: function method2() {
                return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
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
            value: function method3() {
                return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _ctx.next = 2;
                                return s;
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
                return regeneratorRuntime.wrap(function method4$(_ctx) {
                    while(1)switch(_ctx.prev = _ctx.next){
                        case 0:
                            _ctx.next = 2;
                            return s;
                        case 2:
                        case "end":
                            return _ctx.stop();
                    }
                }, method4);
            })
        },
        {
            key: "method5",
            value: function method5(param) {
                var p = param === void 0 ? s : param;
                return p;
            }
        }
    ]);
    return C0;
}();
C0.a = s;
C0.b = N.s;
C0.c = N["s"];
C0.d = s;
C0.e = N.s;
C0.f = N["s"];
// non-widening positions
// element access
o[s];
o[N.s];
o[N["s"]];
// arguments (no-inference)
f(s);
f(N.s);
f(N["s"]);
g(s);
g(N.s);
g(N["s"]);
// falsy expressions
s || "";
N.s || "";
N["s"] || "";
// conditionals
Math.random() * 2 ? s : "a";
Math.random() * 2 ? N.s : "a";
Math.random() * 2 ? N["s"] : "a";
var _obj;
// computed property names
(_obj = {
}, _defineProperty(_obj, s, "a"), _defineProperty(_obj, N.s, "b"), _obj);
var C1 = function C1() {
    "use strict";
    _classCallCheck(this, C1);
};
var o3 = {
    method1: function() {
        return s; // return type should not widen due to contextual type
    },
    method2: function() {
        return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.abrupt("return", s);
                    case 1:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    },
    method3: function() {
        return _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return s;
                    case 2:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    },
    method4: regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return s;
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }),
    method5: function(param) {
        var p = param === void 0 ? s : param;
        return p;
    }
};
// allowed when not emitting declarations
var o4 = {
    method1: function(p) {
        return p;
    },
    method2: function(p) {
        return p;
    }
};
var ce0 = /*#__PURE__*/ function() {
    "use strict";
    function _class() {
        _classCallCheck(this, _class);
    }
    _createClass(_class, [
        {
            key: "method1",
            value: function method1(p) {
                return p;
            }
        },
        {
            key: "method2",
            value: function method2(p) {
                return p;
            }
        }
    ]);
    return _class;
}();
function funcInferredReturnType(obj) {
    return obj;
}
