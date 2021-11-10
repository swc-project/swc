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
"function" == typeof Symbol && Symbol.asyncIterator && (AsyncGenerator.prototype[Symbol.asyncIterator] = function() {
    return this;
}), AsyncGenerator.prototype.next = function(arg) {
    return this._invoke("next", arg);
}, AsyncGenerator.prototype.throw = function(arg) {
    return this._invoke("throw", arg);
}, AsyncGenerator.prototype.return = function(arg) {
    return this._invoke("return", arg);
};
let [x1] = g1, [x2] = g2, [...y1] = g1, [...y2] = g2;
for (_ of ([_] = g1, [_] = g2, [..._] = g1, [..._] = g2, g1));
for (_ of g2);
function _asyncfn() {
    return (_asyncfn = _asyncToGenerator(function*() {
        var _iteratorError, _iteratorAbruptCompletion = !1, _didIteratorError = !1;
        try {
            for(var _step, _iterator = _asyncIterator(g1); _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = !1)_ = _step.value;
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
            for(var _step1, _iterator1 = _asyncIterator(g2); _iteratorAbruptCompletion1 = !(_step1 = yield _iterator1.next()).done; _iteratorAbruptCompletion1 = !1)_ = _step1.value;
        } catch (err1) {
            _didIteratorError1 = !0, _iteratorError1 = err1;
        } finally{
            try {
                _iteratorAbruptCompletion1 && null != _iterator1.return && (yield _iteratorError1.return());
            } finally{
                if (_didIteratorError1) throw _iteratorError1;
            }
        }
        var _iteratorError2, _iteratorAbruptCompletion2 = !1, _didIteratorError2 = !1;
        try {
            for(var _step2, _iterator2 = _asyncIterator(g4); _iteratorAbruptCompletion2 = !(_step2 = yield _iterator2.next()).done; _iteratorAbruptCompletion2 = !1)_ = _step2.value;
        } catch (err2) {
            _didIteratorError2 = !0, _iteratorError2 = err2;
        } finally{
            try {
                _iteratorAbruptCompletion2 && null != _iterator2.return && (yield _iteratorError2.return());
            } finally{
                if (_didIteratorError2) throw _iteratorError2;
            }
        }
        var _iteratorError3, _iteratorAbruptCompletion3 = !1, _didIteratorError3 = !1;
        try {
            for(var _step3, _iterator3 = _asyncIterator(g5); _iteratorAbruptCompletion3 = !(_step3 = yield _iterator3.next()).done; _iteratorAbruptCompletion3 = !1)_ = _step3.value;
        } catch (err3) {
            _didIteratorError3 = !0, _iteratorError3 = err3;
        } finally{
            try {
                _iteratorAbruptCompletion3 && null != _iterator3.return && (yield _iteratorError3.return());
            } finally{
                if (_didIteratorError3) throw _iteratorError3;
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
        yield* g1, yield* g3, yield* g4, yield* g6;
    })).apply(this, arguments);
}
function _f3() {
    return (_f3 = _asyncToGenerator(function*() {
        const syncGenerator = function*() {
            yield 1, yield 2;
        }, o = {
            [Symbol.asyncIterator]: syncGenerator
        };
        var _iteratorError, _iteratorAbruptCompletion = !1, _didIteratorError = !1;
        try {
            for(var _step, _iterator = _asyncIterator(o); _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = !1)_step.value;
        } catch (err) {
            _didIteratorError = !0, _iteratorError = err;
        } finally{
            try {
                _iteratorAbruptCompletion && null != _iterator.return && (yield _iteratorError.return());
            } finally{
                if (_didIteratorError) throw _iteratorError;
            }
        }
    })).apply(this, arguments);
}
