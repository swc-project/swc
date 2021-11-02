import regeneratorRuntime from "regenerator-runtime";
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
function _f1() {
    return (_f1 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    _iteratorAbruptCompletion = !1, _didIteratorError = !1, _ctx.prev = 2, _iterator = _asyncIterator(y);
                case 4:
                    return _ctx.next = 6, _iterator.next();
                case 6:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx.sent).done)) {
                        _ctx.next = 11;
                        break;
                    }
                    x = _value = _step.value;
                case 8:
                    _iteratorAbruptCompletion = !1, _ctx.next = 4;
                    break;
                case 11:
                    _ctx.next = 17;
                    break;
                case 13:
                    _ctx.prev = 13, _ctx.t0 = _ctx.catch(2), _didIteratorError = !0, _iteratorError = _ctx.t0;
                case 17:
                    if (_ctx.prev = 17, _ctx.prev = 18, !(_iteratorAbruptCompletion && null != _iterator.return)) {
                        _ctx.next = 22;
                        break;
                    }
                    return _ctx.next = 22, _iteratorError.return();
                case 22:
                    if (_ctx.prev = 22, !_didIteratorError) {
                        _ctx.next = 25;
                        break;
                    }
                    throw _iteratorError;
                case 25:
                    return _ctx.finish(22);
                case 26:
                    return _ctx.finish(17);
                case 27:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                2,
                13,
                17,
                27
            ],
            [
                18,
                ,
                22,
                26
            ]
        ]);
    }))).apply(this, arguments);
}
function _f2() {
    return (_f2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var x, y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    _iteratorAbruptCompletion = !1, _didIteratorError = !1, _ctx.prev = 2, _iterator = _asyncIterator(y);
                case 4:
                    return _ctx.next = 6, _iterator.next();
                case 6:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx.sent).done)) {
                        _ctx.next = 11;
                        break;
                    }
                    x = _value = _step.value;
                case 8:
                    _iteratorAbruptCompletion = !1, _ctx.next = 4;
                    break;
                case 11:
                    _ctx.next = 17;
                    break;
                case 13:
                    _ctx.prev = 13, _ctx.t0 = _ctx.catch(2), _didIteratorError = !0, _iteratorError = _ctx.t0;
                case 17:
                    if (_ctx.prev = 17, _ctx.prev = 18, !(_iteratorAbruptCompletion && null != _iterator.return)) {
                        _ctx.next = 22;
                        break;
                    }
                    return _ctx.next = 22, _iteratorError.return();
                case 22:
                    if (_ctx.prev = 22, !_didIteratorError) {
                        _ctx.next = 25;
                        break;
                    }
                    throw _iteratorError;
                case 25:
                    return _ctx.finish(22);
                case 26:
                    return _ctx.finish(17);
                case 27:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                2,
                13,
                17,
                27
            ],
            [
                18,
                ,
                22,
                26
            ]
        ]);
    }))).apply(this, arguments);
}
function _f3() {
    return (_f3 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        var y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    _iteratorAbruptCompletion = !1, _didIteratorError = !1, _ctx.prev = 2, _iterator = _asyncIterator(y);
                case 4:
                    return _ctx.next = 6, _awaitAsyncGenerator(_iterator.next());
                case 6:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx.sent).done)) {
                        _ctx.next = 11;
                        break;
                    }
                    x = _value = _step.value;
                case 8:
                    _iteratorAbruptCompletion = !1, _ctx.next = 4;
                    break;
                case 11:
                    _ctx.next = 17;
                    break;
                case 13:
                    _ctx.prev = 13, _ctx.t0 = _ctx.catch(2), _didIteratorError = !0, _iteratorError = _ctx.t0;
                case 17:
                    if (_ctx.prev = 17, _ctx.prev = 18, !(_iteratorAbruptCompletion && null != _iterator.return)) {
                        _ctx.next = 22;
                        break;
                    }
                    return _ctx.next = 22, _iteratorError.return();
                case 22:
                    if (_ctx.prev = 22, !_didIteratorError) {
                        _ctx.next = 25;
                        break;
                    }
                    throw _iteratorError;
                case 25:
                    return _ctx.finish(22);
                case 26:
                    return _ctx.finish(17);
                case 27:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                2,
                13,
                17,
                27
            ],
            [
                18,
                ,
                22,
                26
            ]
        ]);
    }))).apply(this, arguments);
}
function _f4() {
    return (_f4 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        var x, y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    _iteratorAbruptCompletion = !1, _didIteratorError = !1, _ctx.prev = 2, _iterator = _asyncIterator(y);
                case 4:
                    return _ctx.next = 6, _awaitAsyncGenerator(_iterator.next());
                case 6:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx.sent).done)) {
                        _ctx.next = 11;
                        break;
                    }
                    x = _value = _step.value;
                case 8:
                    _iteratorAbruptCompletion = !1, _ctx.next = 4;
                    break;
                case 11:
                    _ctx.next = 17;
                    break;
                case 13:
                    _ctx.prev = 13, _ctx.t0 = _ctx.catch(2), _didIteratorError = !0, _iteratorError = _ctx.t0;
                case 17:
                    if (_ctx.prev = 17, _ctx.prev = 18, !(_iteratorAbruptCompletion && null != _iterator.return)) {
                        _ctx.next = 22;
                        break;
                    }
                    return _ctx.next = 22, _iteratorError.return();
                case 22:
                    if (_ctx.prev = 22, !_didIteratorError) {
                        _ctx.next = 25;
                        break;
                    }
                    throw _iteratorError;
                case 25:
                    return _ctx.finish(22);
                case 26:
                    return _ctx.finish(17);
                case 27:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                2,
                13,
                17,
                27
            ],
            [
                18,
                ,
                22,
                26
            ]
        ]);
    }))).apply(this, arguments);
}
function _f5() {
    return (_f5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    _iteratorAbruptCompletion = !1, _didIteratorError = !1, _ctx.prev = 2, _iterator = _asyncIterator(y);
                case 4:
                    return _ctx.next = 6, _iterator.next();
                case 6:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx.sent).done)) {
                        _ctx.next = 13;
                        break;
                    }
                    return x = _value = _step.value, _ctx.abrupt("continue", 29);
                case 10:
                    _iteratorAbruptCompletion = !1, _ctx.next = 4;
                    break;
                case 13:
                    _ctx.next = 19;
                    break;
                case 15:
                    _ctx.prev = 15, _ctx.t0 = _ctx.catch(2), _didIteratorError = !0, _iteratorError = _ctx.t0;
                case 19:
                    if (_ctx.prev = 19, _ctx.prev = 20, !(_iteratorAbruptCompletion && null != _iterator.return)) {
                        _ctx.next = 24;
                        break;
                    }
                    return _ctx.next = 24, _iteratorError.return();
                case 24:
                    if (_ctx.prev = 24, !_didIteratorError) {
                        _ctx.next = 27;
                        break;
                    }
                    throw _iteratorError;
                case 27:
                    return _ctx.finish(24);
                case 28:
                    return _ctx.finish(19);
                case 29:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                2,
                15,
                19,
                29
            ],
            [
                20,
                ,
                24,
                28
            ]
        ]);
    }))).apply(this, arguments);
}
function _f6() {
    return (_f6 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        var y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    _iteratorAbruptCompletion = !1, _didIteratorError = !1, _ctx.prev = 2, _iterator = _asyncIterator(y);
                case 4:
                    return _ctx.next = 6, _awaitAsyncGenerator(_iterator.next());
                case 6:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx.sent).done)) {
                        _ctx.next = 13;
                        break;
                    }
                    return x = _value = _step.value, _ctx.abrupt("continue", 29);
                case 10:
                    _iteratorAbruptCompletion = !1, _ctx.next = 4;
                    break;
                case 13:
                    _ctx.next = 19;
                    break;
                case 15:
                    _ctx.prev = 15, _ctx.t0 = _ctx.catch(2), _didIteratorError = !0, _iteratorError = _ctx.t0;
                case 19:
                    if (_ctx.prev = 19, _ctx.prev = 20, !(_iteratorAbruptCompletion && null != _iterator.return)) {
                        _ctx.next = 24;
                        break;
                    }
                    return _ctx.next = 24, _iteratorError.return();
                case 24:
                    if (_ctx.prev = 24, !_didIteratorError) {
                        _ctx.next = 27;
                        break;
                    }
                    throw _iteratorError;
                case 27:
                    return _ctx.finish(24);
                case 28:
                    return _ctx.finish(19);
                case 29:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                2,
                15,
                19,
                29
            ],
            [
                20,
                ,
                24,
                28
            ]
        ]);
    }))).apply(this, arguments);
}
function _f7() {
    return (_f7 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        var y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                case 1:
                    _iteratorAbruptCompletion = !1, _didIteratorError = !1, _ctx.prev = 2, _iterator = _asyncIterator(y);
                case 4:
                    return _ctx.next = 6, _awaitAsyncGenerator(_iterator.next());
                case 6:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx.sent).done)) {
                        _ctx.next = 11;
                        break;
                    }
                    x = _value = _step.value;
                case 8:
                    _iteratorAbruptCompletion = !1, _ctx.next = 4;
                    break;
                case 11:
                    _ctx.next = 17;
                    break;
                case 13:
                    _ctx.prev = 13, _ctx.t0 = _ctx.catch(2), _didIteratorError = !0, _iteratorError = _ctx.t0;
                case 17:
                    if (_ctx.prev = 17, _ctx.prev = 18, !(_iteratorAbruptCompletion && null != _iterator.return)) {
                        _ctx.next = 22;
                        break;
                    }
                    return _ctx.next = 22, _iteratorError.return();
                case 22:
                    if (_ctx.prev = 22, !_didIteratorError) {
                        _ctx.next = 25;
                        break;
                    }
                    throw _iteratorError;
                case 25:
                    return _ctx.finish(22);
                case 26:
                    return _ctx.finish(17);
                case 27:
                    _ctx.next = 1;
                    break;
                case 29:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                2,
                13,
                17,
                27
            ],
            [
                18,
                ,
                22,
                26
            ]
        ]);
    }))).apply(this, arguments);
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
