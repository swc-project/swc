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
    x() {}
    y() {}
}
class B extends A {
    // async method with only call/get on 'super' does not require a binding
    simple() {
        var _this = this, // call with property access
        _superprop_get_x = ()=>super.x
        , // call additional property.
        _superprop_get_y = ()=>super.y
        , // call with element access
        _superprop_get = (_prop)=>super[_prop]
        ;
        return _asyncToGenerator(function*() {
            _superprop_get_x().call(_this);
            _superprop_get_y().call(_this);
            _superprop_get("x").call(_this);
            // property access (read)
            const a = _superprop_get_x();
            // element access (read)
            const b = _superprop_get("x");
        })();
    }
    // async method with assignment/destructuring on 'super' requires a binding
    advanced() {
        var _this = this, // call with property access
        _superprop_get_x = ()=>super.x
        , // call with element access
        _superprop_get = (_prop)=>super[_prop]
        , // property access (assign)
        _superprop_set_x = (_value)=>super.x = _value
        , // element access (assign)
        _superprop_set = (_prop, _value)=>super[_prop] = _value
        ;
        return _asyncToGenerator(function*() {
            const f = ()=>{};
            _superprop_get_x().call(_this);
            _superprop_get("x").call(_this);
            // property access (read)
            const a = _superprop_get_x();
            // element access (read)
            const b = _superprop_get("x");
            _superprop_set_x(f);
            _superprop_set("x", f);
            // destructuring assign with property access
            ({ f: _superprop_get_x()  } = {
                f
            });
            // destructuring assign with element access
            ({ f: _superprop_get("x")  } = {
                f
            });
            // property access in arrow
            (()=>_superprop_get_x().call(_this)
            );
            // element access in arrow
            (()=>_superprop_get("x").call(_this)
            );
            // property access in async arrow
            _asyncToGenerator(function*() {
                return _superprop_get_x().call(_this);
            });
            // element access in async arrow
            _asyncToGenerator(function*() {
                return _superprop_get("x").call(_this);
            });
        })();
    }
    property_access_only_read_only() {
        var _this = this, // call with property access
        _superprop_get_x = ()=>super.x
        ;
        return _asyncToGenerator(function*() {
            _superprop_get_x().call(_this);
            // property access (read)
            const a = _superprop_get_x();
            // property access in arrow
            (()=>_superprop_get_x().call(_this)
            );
            // property access in async arrow
            _asyncToGenerator(function*() {
                return _superprop_get_x().call(_this);
            });
        })();
    }
    property_access_only_write_only() {
        var _superprop_get_x = ()=>super.x
        , // property access (assign)
        _superprop_set_x = (_value)=>super.x = _value
        ;
        return _asyncToGenerator(function*() {
            const f = ()=>{};
            _superprop_set_x(f);
            // destructuring assign with property access
            ({ f: _superprop_get_x()  } = {
                f
            });
            // property access (assign) in arrow
            (()=>_superprop_set_x(f)
            );
            // property access (assign) in async arrow
            _asyncToGenerator(function*() {
                return _superprop_set_x(f);
            });
        })();
    }
    element_access_only_read_only() {
        var _this = this, // call with element access
        _superprop_get = (_prop)=>super[_prop]
        ;
        return _asyncToGenerator(function*() {
            _superprop_get("x").call(_this);
            // element access (read)
            const a = _superprop_get("x");
            // element access in arrow
            (()=>_superprop_get("x").call(_this)
            );
            // element access in async arrow
            _asyncToGenerator(function*() {
                return _superprop_get("x").call(_this);
            });
        })();
    }
    element_access_only_write_only() {
        var _superprop_get = (_prop)=>super[_prop]
        , // element access (assign)
        _superprop_set = (_prop, _value)=>super[_prop] = _value
        ;
        return _asyncToGenerator(function*() {
            const f = ()=>{};
            _superprop_set("x", f);
            // destructuring assign with element access
            ({ f: _superprop_get("x")  } = {
                f
            });
            // element access (assign) in arrow
            (()=>_superprop_set("x", f)
            );
            // element access (assign) in async arrow
            _asyncToGenerator(function*() {
                return _superprop_set("x", f);
            });
        })();
    }
    property_access_only_read_only_in_generator() {
        var _this = this, // call with property access
        _superprop_get_x = ()=>super.x
        ;
        return _wrapAsyncGenerator(function*() {
            _superprop_get_x().call(_this);
            // property access (read)
            const a = _superprop_get_x();
            // property access in arrow
            (()=>_superprop_get_x().call(_this)
            );
            // property access in async arrow
            _asyncToGenerator(function*() {
                return _superprop_get_x().call(_this);
            });
        })();
    }
    property_access_only_write_only_in_generator() {
        var _superprop_get_x = ()=>super.x
        , // property access (assign)
        _superprop_set_x = (_value)=>super.x = _value
        ;
        return _wrapAsyncGenerator(function*() {
            const f = ()=>{};
            _superprop_set_x(f);
            // destructuring assign with property access
            ({ f: _superprop_get_x()  } = {
                f
            });
            // property access (assign) in arrow
            (()=>_superprop_set_x(f)
            );
            // property access (assign) in async arrow
            _asyncToGenerator(function*() {
                return _superprop_set_x(f);
            });
        })();
    }
    element_access_only_read_only_in_generator() {
        var _this = this, // call with element access
        _superprop_get = (_prop)=>super[_prop]
        ;
        return _wrapAsyncGenerator(function*() {
            _superprop_get("x").call(_this);
            // element access (read)
            const a = _superprop_get("x");
            // element access in arrow
            (()=>_superprop_get("x").call(_this)
            );
            // element access in async arrow
            _asyncToGenerator(function*() {
                return _superprop_get("x").call(_this);
            });
        })();
    }
    element_access_only_write_only_in_generator() {
        var _superprop_get = (_prop)=>super[_prop]
        , // element access (assign)
        _superprop_set = (_prop, _value)=>super[_prop] = _value
        ;
        return _wrapAsyncGenerator(function*() {
            const f = ()=>{};
            _superprop_set("x", f);
            // destructuring assign with element access
            ({ f: _superprop_get("x")  } = {
                f
            });
            // element access (assign) in arrow
            (()=>_superprop_set("x", f)
            );
            // element access (assign) in async arrow
            _asyncToGenerator(function*() {
                return _superprop_set("x", f);
            });
        })();
    }
}
