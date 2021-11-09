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
function _asyncIterator(iterable) {
    var method;
    if ("function" == typeof Symbol) {
        if (Symbol.asyncIterator && null != (method = iterable[Symbol.asyncIterator])) return method.call(iterable);
        if (Symbol.iterator && null != (method = iterable[Symbol.iterator])) return method.call(iterable);
    }
    throw new TypeError("Object is not async iterable");
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
function _awaitAsyncGenerator(value) {
    return new _AwaitValue(value);
}
function _AwaitValue(value) {
    this.wrapped = value;
}
function _f1() {
    return (_f1 = (function(fn) {
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
    })(function*() {
        var _iteratorError, _iteratorAbruptCompletion = !1, _didIteratorError = !1;
        try {
            for(var _step, _iterator = _asyncIterator({
            }); _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = !1)_step.value;
        } catch (err) {
            _didIteratorError = !0, _iteratorError = err;
        } finally{
            try {
                _iteratorAbruptCompletion && null != _iterator.return && (yield _iteratorError.return());
            } finally{
                if (_didIteratorError) throw _iteratorError;
            }
        }
        var _iteratorError1, _iteratorAbruptCompletion1 = !1, _didIteratorError1 = !1;
        try {
            for(var _step1, _iterator1 = _asyncIterator({
            }); _iteratorAbruptCompletion1 = !(_step1 = yield _iterator1.next()).done; _iteratorAbruptCompletion1 = !1)_step1.value;
        } catch (err1) {
            _didIteratorError1 = !0, _iteratorError1 = err1;
        } finally{
            try {
                _iteratorAbruptCompletion1 && null != _iterator1.return && (yield _iteratorError1.return());
            } finally{
                if (_didIteratorError1) throw _iteratorError1;
            }
        }
    })).apply(this, arguments);
}
function _f2() {
    return (_f2 = (function(fn) {
        return function() {
            return new AsyncGenerator(fn.apply(this, arguments));
        };
    })(function*() {
        var _iteratorError, _iteratorAbruptCompletion = !1, _didIteratorError = !1;
        try {
            for(var _step, _iterator = _asyncIterator({
            }); _iteratorAbruptCompletion = !(_step = yield _awaitAsyncGenerator(_iterator.next())).done; _iteratorAbruptCompletion = !1)_step.value;
        } catch (err) {
            _didIteratorError = !0, _iteratorError = err;
        } finally{
            try {
                _iteratorAbruptCompletion && null != _iterator.return && (yield _iteratorError.return());
            } finally{
                if (_didIteratorError) throw _iteratorError;
            }
        }
        var _iteratorError2, _iteratorAbruptCompletion2 = !1, _didIteratorError2 = !1;
        try {
            for(var _step2, _iterator2 = _asyncIterator({
            }); _iteratorAbruptCompletion2 = !(_step2 = yield _awaitAsyncGenerator(_iterator2.next())).done; _iteratorAbruptCompletion2 = !1)_step2.value;
        } catch (err2) {
            _didIteratorError2 = !0, _iteratorError2 = err2;
        } finally{
            try {
                _iteratorAbruptCompletion2 && null != _iterator2.return && (yield _iteratorError2.return());
            } finally{
                if (_didIteratorError2) throw _iteratorError2;
            }
        }
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
};
