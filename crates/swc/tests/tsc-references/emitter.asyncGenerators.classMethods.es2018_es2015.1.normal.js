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
function _awaitAsyncGenerator(value) {
    return new _AwaitValue(value);
}
function _AwaitValue(value) {
    this.wrapped = value;
}
function _wrapAsyncGenerator(fn) {
    return function() {
        return new AsyncGenerator(fn.apply(this, arguments));
    };
}
// @target: es2018
// @lib: esnext
// @filename: C1.ts
class C1 {
    f() {
        return _wrapAsyncGenerator(function*() {
        })();
    }
}
// @filename: C2.ts
class C2 {
    f() {
        return _wrapAsyncGenerator(function*() {
            const x = yield;
        })();
    }
}
// @filename: C3.ts
class C3 {
    f() {
        return _wrapAsyncGenerator(function*() {
            const x = yield 1;
        })();
    }
}
// @filename: C4.ts
class C4 {
    f() {
        return _wrapAsyncGenerator(function*() {
            const x = yield* [
                1
            ];
        })();
    }
}
// @filename: C5.ts
class C5 {
    f() {
        return _wrapAsyncGenerator(function*() {
            const x = yield* _wrapAsyncGenerator(function*() {
                yield 1;
            })();
        })();
    }
}
// @filename: C6.ts
class C6 {
    f() {
        return _wrapAsyncGenerator(function*() {
            const x = yield _awaitAsyncGenerator(1);
        })();
    }
}
// @filename: C7.ts
class C7 {
    f() {
        return _wrapAsyncGenerator(function*() {
            return 1;
        })();
    }
}
// @filename: C8.ts
class C8 {
    g() {
    }
    f() {
        return _wrapAsyncGenerator((function*() {
            this.g();
        }).bind(this))();
    }
}
// @filename: C9.ts
class B9 {
    g() {
    }
}
class C9 extends B9 {
    f() {
        var _super_g = (..._args)=>super.g(..._args)
        ;
        return _wrapAsyncGenerator(function*() {
            _super_g();
        })();
    }
}
