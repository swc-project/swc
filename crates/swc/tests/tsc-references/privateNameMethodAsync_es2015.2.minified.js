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
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return fn;
}
function _classPrivateMethodInit(obj, privateSet) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateSet), privateSet.add(obj);
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
const C = function() {
    var _bar = new WeakSet(), _baz = new WeakSet(), _qux = new WeakSet();
    function bar() {
        return _bar1.apply(this, arguments);
    }
    function _bar1() {
        return (_bar1 = _asyncToGenerator(function*() {
            return yield Promise.resolve(42);
        })).apply(this, arguments);
    }
    function* baz() {
        yield 42;
    }
    function qux() {
        return _qux1.apply(this, arguments);
    }
    function _qux1() {
        return (_qux1 = (function(fn) {
            return function() {
                return new AsyncGenerator(fn.apply(this, arguments));
            };
        })(function*() {
            var value;
            yield yield value = Promise.resolve(42), new _AwaitValue(value);
        })).apply(this, arguments);
    }
    return class {
        foo() {
            var _this = this;
            return _asyncToGenerator(function*() {
                const b = yield _classPrivateMethodGet(_this, _bar, bar).call(_this);
                return b + (_classPrivateMethodGet(_this, _baz, baz).call(_this).next().value || 0) + ((yield _classPrivateMethodGet(_this, _qux, qux).call(_this).next()).value || 0);
            })();
        }
        constructor(){
            _classPrivateMethodInit(this, _bar), _classPrivateMethodInit(this, _baz), _classPrivateMethodInit(this, _qux);
        }
    };
}();
new C().foo().then(console.log);
