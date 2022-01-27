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
function _AwaitValue(value) {
    this.wrapped = value;
}
function _wrapAsyncGenerator(fn) {
    return function() {
        return new AsyncGenerator(fn.apply(this, arguments));
    };
}
function _inferReturnType2() {
    return (_inferReturnType2 = _wrapAsyncGenerator(function*() {
        yield* (function() {
            return _inferReturnType2.apply(this, arguments);
        })();
    })).apply(this, arguments);
}
"function" == typeof Symbol && Symbol.asyncIterator && (AsyncGenerator.prototype[Symbol.asyncIterator] = function() {
    return this;
}), AsyncGenerator.prototype.next = function(arg) {
    return this._invoke("next", arg);
}, AsyncGenerator.prototype.throw = function(arg) {
    return this._invoke("throw", arg);
}, AsyncGenerator.prototype.return = function(arg) {
    return this._invoke("return", arg);
}, _wrapAsyncGenerator(function*() {
    yield "a";
}), _wrapAsyncGenerator(function*() {
    yield* [
        "a",
        "b"
    ];
}), _wrapAsyncGenerator(function*() {
    yield* _wrapAsyncGenerator(function*() {
        yield "a";
    })();
}), _wrapAsyncGenerator(function*() {
    yield "a";
}), _wrapAsyncGenerator(function*() {
    yield* [
        "a",
        "b"
    ];
}), _wrapAsyncGenerator(function*() {
    yield* _wrapAsyncGenerator(function*() {
        yield "a";
    })();
}), _wrapAsyncGenerator(function*() {
    yield "a";
}), _wrapAsyncGenerator(function*() {
    yield* [
        "a",
        "b"
    ];
}), _wrapAsyncGenerator(function*() {
    yield* _wrapAsyncGenerator(function*() {
        yield "a";
    })();
});
