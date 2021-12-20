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
function _wrapAsyncGenerator(fn) {
    return function() {
        return new AsyncGenerator(fn.apply(this, arguments));
    };
}
// @target: ES6
// @lib: esnext
// @noEmitHelpers: true
class A {
    x() {
    }
    y() {
    }
}
class B extends A {
    // async method with only call/get on 'super' does not require a binding
    simple() {
        var _super_x = (..._args)=>super.x(..._args)
        , _super_y = (..._args)=>super.y(..._args)
        , _super_method = (..._args)=>super["x"](..._args)
        , _super_x1 = ()=>super.x
        , _super_method1 = ()=>super["x"]
        ;
        return _asyncToGenerator(function*() {
            // call with property access
            _super_x();
            // call additional property.
            _super_y();
            // call with element access
            _super_method();
            // property access (read)
            const a = _super_x1();
            // element access (read)
            const b = _super_method1();
        })();
    }
    // async method with assignment/destructuring on 'super' requires a binding
    advanced() {
        var _super_x = (..._args)=>super.x(..._args)
        , _super_method = (..._args)=>super["x"](..._args)
        , _super_x2 = ()=>super.x
        , _super_method2 = ()=>super["x"]
        , _super_x3 = (_args)=>// property access (assign)
            super.x = _args
        , _super_method3 = (_args)=>// element access (assign)
            super["x"] = _args
        , _super_x4 = ()=>super.x
        , _super_method4 = ()=>super["x"]
        , _super_x5 = (..._args)=>super.x(..._args)
        , _super_method5 = (..._args)=>super["x"](..._args)
        , _super_x6 = (..._args)=>super.x(..._args)
        , _super_method6 = (..._args)=>super["x"](..._args)
        ;
        return _asyncToGenerator(function*() {
            const f = ()=>{
            };
            // call with property access
            _super_x();
            // call with element access
            _super_method();
            // property access (read)
            const a = _super_x2();
            // element access (read)
            const b = _super_method2();
            _super_x3(f);
            _super_method3(f);
            // destructuring assign with property access
            ({ f: _super_x4()  } = {
                f
            });
            // destructuring assign with element access
            ({ f: _super_method4()  } = {
                f
            });
            // property access in arrow
            (()=>_super_x5()
            );
            // element access in arrow
            (()=>_super_method5()
            );
            // property access in async arrow
            _asyncToGenerator(function*() {
                return _super_x6();
            });
            // element access in async arrow
            _asyncToGenerator(function*() {
                return _super_method6();
            });
        })();
    }
    property_access_only_read_only() {
        var _super_x = (..._args)=>super.x(..._args)
        , _super_x7 = ()=>super.x
        , _super_x8 = (..._args)=>super.x(..._args)
        , _super_x9 = (..._args)=>super.x(..._args)
        ;
        return _asyncToGenerator(function*() {
            // call with property access
            _super_x();
            // property access (read)
            const a = _super_x7();
            // property access in arrow
            (()=>_super_x8()
            );
            // property access in async arrow
            _asyncToGenerator(function*() {
                return _super_x9();
            });
        })();
    }
    property_access_only_write_only() {
        var _super_x = (_args)=>// property access (assign)
            super.x = _args
        , _super_x10 = ()=>super.x
        , _super_x11 = (_args)=>super.x = _args
        , _super_x12 = (_args)=>super.x = _args
        ;
        return _asyncToGenerator(function*() {
            const f = ()=>{
            };
            _super_x(f);
            // destructuring assign with property access
            ({ f: _super_x10()  } = {
                f
            });
            // property access (assign) in arrow
            (()=>_super_x11(f)
            );
            // property access (assign) in async arrow
            _asyncToGenerator(function*() {
                return _super_x12(f);
            });
        })();
    }
    element_access_only_read_only() {
        var _super_method = (..._args)=>super["x"](..._args)
        , _super_method7 = ()=>super["x"]
        , _super_method8 = (..._args)=>super["x"](..._args)
        , _super_method9 = (..._args)=>super["x"](..._args)
        ;
        return _asyncToGenerator(function*() {
            // call with element access
            _super_method();
            // element access (read)
            const a = _super_method7();
            // element access in arrow
            (()=>_super_method8()
            );
            // element access in async arrow
            _asyncToGenerator(function*() {
                return _super_method9();
            });
        })();
    }
    element_access_only_write_only() {
        var _super_method = (_args)=>// element access (assign)
            super["x"] = _args
        , _super_method10 = ()=>super["x"]
        , _super_method11 = (_args)=>super["x"] = _args
        , _super_method12 = (_args)=>super["x"] = _args
        ;
        return _asyncToGenerator(function*() {
            const f = ()=>{
            };
            _super_method(f);
            // destructuring assign with element access
            ({ f: _super_method10()  } = {
                f
            });
            // element access (assign) in arrow
            (()=>_super_method11(f)
            );
            // element access (assign) in async arrow
            _asyncToGenerator(function*() {
                return _super_method12(f);
            });
        })();
    }
    property_access_only_read_only_in_generator() {
        var _super_x = (..._args)=>super.x(..._args)
        , _super_x13 = ()=>super.x
        , _super_x14 = (..._args)=>super.x(..._args)
        , _super_x15 = (..._args)=>super.x(..._args)
        ;
        return _wrapAsyncGenerator(function*() {
            // call with property access
            _super_x();
            // property access (read)
            const a = _super_x13();
            // property access in arrow
            (()=>_super_x14()
            );
            // property access in async arrow
            _asyncToGenerator(function*() {
                return _super_x15();
            });
        })();
    }
    property_access_only_write_only_in_generator() {
        var _super_x = (_args)=>// property access (assign)
            super.x = _args
        , _super_x16 = ()=>super.x
        , _super_x17 = (_args)=>super.x = _args
        , _super_x18 = (_args)=>super.x = _args
        ;
        return _wrapAsyncGenerator(function*() {
            const f = ()=>{
            };
            _super_x(f);
            // destructuring assign with property access
            ({ f: _super_x16()  } = {
                f
            });
            // property access (assign) in arrow
            (()=>_super_x17(f)
            );
            // property access (assign) in async arrow
            _asyncToGenerator(function*() {
                return _super_x18(f);
            });
        })();
    }
    element_access_only_read_only_in_generator() {
        var _super_method = (..._args)=>super["x"](..._args)
        , _super_method13 = ()=>super["x"]
        , _super_method14 = (..._args)=>super["x"](..._args)
        , _super_method15 = (..._args)=>super["x"](..._args)
        ;
        return _wrapAsyncGenerator(function*() {
            // call with element access
            _super_method();
            // element access (read)
            const a = _super_method13();
            // element access in arrow
            (()=>_super_method14()
            );
            // element access in async arrow
            _asyncToGenerator(function*() {
                return _super_method15();
            });
        })();
    }
    element_access_only_write_only_in_generator() {
        var _super_method = (_args)=>// element access (assign)
            super["x"] = _args
        , _super_method16 = ()=>super["x"]
        , _super_method17 = (_args)=>super["x"] = _args
        , _super_method18 = (_args)=>super["x"] = _args
        ;
        return _wrapAsyncGenerator(function*() {
            const f = ()=>{
            };
            _super_method(f);
            // destructuring assign with element access
            ({ f: _super_method16()  } = {
                f
            });
            // element access (assign) in arrow
            (()=>_super_method17(f)
            );
            // element access (assign) in async arrow
            _asyncToGenerator(function*() {
                return _super_method18(f);
            });
        })();
    }
}
