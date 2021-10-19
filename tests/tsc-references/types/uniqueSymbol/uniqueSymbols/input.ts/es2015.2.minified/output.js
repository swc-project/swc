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
const constCall = Symbol();
let letCall = Symbol();
var varCall = Symbol();
function _asyncFuncReturnConstCall() {
    return (_asyncFuncReturnConstCall = _asyncToGenerator(function*() {
        return constCall;
    })).apply(this, arguments);
}
function _asyncFuncReturnLetCall() {
    return (_asyncFuncReturnLetCall = _asyncToGenerator(function*() {
        return letCall;
    })).apply(this, arguments);
}
function _asyncFuncReturnVarCall() {
    return (_asyncFuncReturnVarCall = _asyncToGenerator(function*() {
        return varCall;
    })).apply(this, arguments);
}
function _asyncGenFuncYieldConstCall() {
    return (_asyncGenFuncYieldConstCall = _wrapAsyncGenerator(function*() {
        yield constCall;
    })).apply(this, arguments);
}
function _asyncGenFuncYieldLetCall() {
    return (_asyncGenFuncYieldLetCall = _wrapAsyncGenerator(function*() {
        yield letCall;
    })).apply(this, arguments);
}
function _asyncGenFuncYieldVarCall() {
    return (_asyncGenFuncYieldVarCall = _wrapAsyncGenerator(function*() {
        yield varCall;
    })).apply(this, arguments);
}
Symbol();
class C {
    constructor(){
        this.readonlyCall = Symbol(), this.readwriteCall = Symbol();
    }
}
C.readonlyStaticCall = Symbol(), C.readonlyStaticTypeAndCall = Symbol(), C.readwriteStaticCall = Symbol(), l.nested.readonlyNestedType, l.nested.readonlyNestedType, l.nested.readonlyNestedType, Promise.resolve(constCall), f(s), f(N.s), f(N.s);
class C0 {
    method1() {
        return s;
    }
    method2() {
        return _asyncToGenerator(function*() {
            return s;
        })();
    }
    method3() {
        return _wrapAsyncGenerator(function*() {
            yield s;
        })();
    }
    *method4() {
        yield s;
    }
    method5(p = s) {
        return p;
    }
    constructor(){
        this.a = s, this.b = N.s, this.c = N.s, this.d = s, this.e = N.s, this.f = N.s;
    }
}
C0.a = s, C0.b = N.s, C0.c = N.s, C0.d = s, C0.e = N.s, C0.f = N.s, o[s], o[N.s], o[N.s], f(s), f(N.s), f(N.s), g(s), g(N.s), g(N.s);
