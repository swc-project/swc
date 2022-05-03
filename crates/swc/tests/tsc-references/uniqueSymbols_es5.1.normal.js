import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var _marked = regeneratorRuntime.mark(genFuncYieldConstCallWithTypeQuery);
var _marked1 = regeneratorRuntime.mark(genFuncYieldVarCall);
var _marked2 = regeneratorRuntime.mark(genFuncYieldLetCall);
var _marked3 = regeneratorRuntime.mark(genFuncYieldConstCall);
// @target: esnext
// @lib: esnext
// @declaration: false
// @useDefineForClassFields: false
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
var fromAny = {};
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
    swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
    _asyncFuncReturnLetCall = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
    _asyncFuncReturnVarCall = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
    swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
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
    _asyncGenFuncYieldLetCall = swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
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
    _asyncGenFuncYieldVarCall = swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
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
// classes
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
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
    method1: function method1() {
        return s;
    },
    method2: function method2() {
        return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
    method3: function method3() {
        return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
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
    method4: regeneratorRuntime.mark(function method4() {
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
    }),
    method5: function method5() {
        var p = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : s;
        return p;
    }
};
// property initializers
var C0 = /*#__PURE__*/ function() {
    "use strict";
    function C0() {
        swcHelpers.classCallCheck(this, C0);
        this.a = s;
        this.b = N.s;
        this.c = N["s"];
        this.d = s;
        this.e = N.s;
        this.f = N["s"];
    }
    var _proto = C0.prototype;
    _proto.method1 = function method1() {
        return s;
    };
    _proto.method2 = function method2() {
        return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
    };
    _proto.method3 = function method3() {
        return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
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
    };
    _proto.method4 = regeneratorRuntime.mark(function method4() {
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
    });
    _proto.method5 = function method5() {
        var p = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : s;
        return p;
    };
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
(_obj = {}, swcHelpers.defineProperty(_obj, s, "a"), swcHelpers.defineProperty(_obj, N.s, "b"), _obj);
var _key, _key1, _key2, _key3;
var C1 = function C1() {
    "use strict";
    swcHelpers.classCallCheck(this, C1);
};
_key = s;
_key1 = N.s;
_key2 = s;
_key3 = N.s;
var o3 = {
    method1: function method1() {
        return s; // return type should not widen due to contextual type
    },
    method2: function method2() {
        return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
    method3: function method3() {
        return swcHelpers.wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
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
    method4: regeneratorRuntime.mark(function method4() {
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
    }),
    method5: function method5() {
        var p = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : s;
        return p;
    }
};
// allowed when not emitting declarations
var o4 = {
    method1: function method1(p) {
        return p;
    },
    method2: function method2(p) {
        return p;
    }
};
var ce0 = /*#__PURE__*/ function() {
    "use strict";
    function _class() {
        swcHelpers.classCallCheck(this, _class);
    }
    var _proto = _class.prototype;
    _proto.method1 = function method1(p) {
        return p;
    };
    _proto.method2 = function method2(p) {
        return p;
    };
    return _class;
}();
function funcInferredReturnType(obj) {
    return obj;
}
