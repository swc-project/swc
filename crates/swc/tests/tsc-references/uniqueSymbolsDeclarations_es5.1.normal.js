// @target: esnext
// @lib: esnext
// @declaration: true
// @useDefineForClassFields: false
// declarations with call initializer
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
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
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    constCall
                ];
            case 1:
                _state.sent();
                return [
                    2
                ];
        }
    });
}
function genFuncYieldLetCall() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    letCall
                ];
            case 1:
                _state.sent();
                return [
                    2
                ];
        }
    });
}
function genFuncYieldVarCall() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    varCall
                ];
            case 1:
                _state.sent();
                return [
                    2
                ];
        }
    });
}
// generator function yield with return type query
function genFuncYieldConstCallWithTypeQuery() {
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    constCall
                ];
            case 1:
                _state.sent();
                return [
                    2
                ];
        }
    });
}
function asyncFuncReturnConstCall() {
    return _asyncFuncReturnConstCall.apply(this, arguments);
}
function _asyncFuncReturnConstCall() {
    _asyncFuncReturnConstCall = // async function return inference
    _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                constCall
            ];
        });
    });
    return _asyncFuncReturnConstCall.apply(this, arguments);
}
function asyncFuncReturnLetCall() {
    return _asyncFuncReturnLetCall.apply(this, arguments);
}
function _asyncFuncReturnLetCall() {
    _asyncFuncReturnLetCall = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                letCall
            ];
        });
    });
    return _asyncFuncReturnLetCall.apply(this, arguments);
}
function asyncFuncReturnVarCall() {
    return _asyncFuncReturnVarCall.apply(this, arguments);
}
function _asyncFuncReturnVarCall() {
    _asyncFuncReturnVarCall = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                varCall
            ];
        });
    });
    return _asyncFuncReturnVarCall.apply(this, arguments);
}
function asyncGenFuncYieldConstCall() {
    return _asyncGenFuncYieldConstCall.apply(this, arguments);
}
function _asyncGenFuncYieldConstCall() {
    _asyncGenFuncYieldConstCall = // async generator function yield inference
    _wrap_async_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        constCall
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return _asyncGenFuncYieldConstCall.apply(this, arguments);
}
function asyncGenFuncYieldLetCall() {
    return _asyncGenFuncYieldLetCall.apply(this, arguments);
}
function _asyncGenFuncYieldLetCall() {
    _asyncGenFuncYieldLetCall = _wrap_async_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        letCall
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return _asyncGenFuncYieldLetCall.apply(this, arguments);
}
function asyncGenFuncYieldVarCall() {
    return _asyncGenFuncYieldVarCall.apply(this, arguments);
}
function _asyncGenFuncYieldVarCall() {
    _asyncGenFuncYieldVarCall = _wrap_async_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        varCall
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return _asyncGenFuncYieldVarCall.apply(this, arguments);
}
// classes
var C = function C() {
    "use strict";
    _class_call_check(this, C);
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
        return _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                return [
                    2,
                    s
                ];
            });
        })();
    },
    method3: function method3() {
        return _wrap_async_generator(function() {
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            s
                        ];
                    case 1:
                        _state.sent();
                        return [
                            2
                        ];
                }
            });
        })();
    },
    method4: function method4() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        s
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    },
    method5: function method5() {
        var p = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : s;
        return p;
    }
};
// property initializers
var C0 = /*#__PURE__*/ function() {
    "use strict";
    function C0() {
        _class_call_check(this, C0);
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
        return _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                return [
                    2,
                    s
                ];
            });
        })();
    };
    _proto.method3 = function method3() {
        return _wrap_async_generator(function() {
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            s
                        ];
                    case 1:
                        _state.sent();
                        return [
                            2
                        ];
                }
            });
        })();
    };
    _proto.method4 = function method4() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        s
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    };
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
(_obj = {}, _define_property(_obj, s, "a"), _define_property(_obj, N.s, "b"), _obj);
var C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
};
var o4 = {
    method1: function method1() {
        return s; // return type should not widen due to contextual type
    },
    method2: function method2() {
        return _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                return [
                    2,
                    s
                ]; // return type should not widen due to contextual type
            });
        })();
    },
    method3: function method3() {
        return _wrap_async_generator(function() {
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            s
                        ];
                    case 1:
                        _state.sent(); // yield type should not widen due to contextual type
                        return [
                            2
                        ];
                }
            });
        })();
    },
    method4: function method4() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        s
                    ];
                case 1:
                    _state.sent(); // yield type should not widen due to contextual type
                    return [
                        2
                    ];
            }
        });
    },
    method5: function method5() {
        var p = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : s;
        return p;
    }
};
