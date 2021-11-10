import regeneratorRuntime from "regenerator-runtime";
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
function _asyncIterator(iterable) {
    var method;
    if (typeof Symbol === "function") {
        if (Symbol.asyncIterator) {
            method = iterable[Symbol.asyncIterator];
            if (method != null) return method.call(iterable);
        }
        if (Symbol.iterator) {
            method = iterable[Symbol.iterator];
            if (method != null) return method.call(iterable);
        }
    }
    throw new TypeError("Object is not async iterable");
}
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
function f1() {
    return _f1.apply(this, arguments);
}
function _f1() {
    _f1 = // @target: es2018
    // @lib: es5
    // @noEmit: true
    _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x, _iteratorAbruptCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, _value1;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    ;
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _ctx.prev = 2;
                    _iterator = _asyncIterator({
                    });
                case 4:
                    _ctx.next = 6;
                    return _iterator.next();
                case 6:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx.sent).done)) {
                        _ctx.next = 11;
                        break;
                    }
                    {
                        _value = _step.value;
                        x = _value;
                    }
                case 8:
                    _iteratorAbruptCompletion = false;
                    _ctx.next = 4;
                    break;
                case 11:
                    _ctx.next = 17;
                    break;
                case 13:
                    _ctx.prev = 13;
                    _ctx.t0 = _ctx["catch"](2);
                    _didIteratorError = true;
                    _iteratorError = _ctx.t0;
                case 17:
                    _ctx.prev = 17;
                    _ctx.prev = 18;
                    if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                        _ctx.next = 22;
                        break;
                    }
                    _ctx.next = 22;
                    return _iteratorError.return();
                case 22:
                    _ctx.prev = 22;
                    if (!_didIteratorError) {
                        _ctx.next = 25;
                        break;
                    }
                    throw _iteratorError;
                case 25:
                    return _ctx.finish(22);
                case 26:
                    return _ctx.finish(17);
                case 27:
                    _iteratorAbruptCompletion1 = false, _didIteratorError1 = false;
                    _ctx.prev = 28;
                    _iterator1 = _asyncIterator({
                    });
                case 30:
                    _ctx.next = 32;
                    return _iterator1.next();
                case 32:
                    if (!(_iteratorAbruptCompletion1 = !(_step1 = _ctx.sent).done)) {
                        _ctx.next = 37;
                        break;
                    }
                    {
                        _value1 = _step1.value;
                        y = _value1;
                    }
                case 34:
                    _iteratorAbruptCompletion1 = false;
                    _ctx.next = 30;
                    break;
                case 37:
                    _ctx.next = 43;
                    break;
                case 39:
                    _ctx.prev = 39;
                    _ctx.t1 = _ctx["catch"](28);
                    _didIteratorError1 = true;
                    _iteratorError1 = _ctx.t1;
                case 43:
                    _ctx.prev = 43;
                    _ctx.prev = 44;
                    if (!(_iteratorAbruptCompletion1 && _iterator1.return != null)) {
                        _ctx.next = 48;
                        break;
                    }
                    _ctx.next = 48;
                    return _iteratorError1.return();
                case 48:
                    _ctx.prev = 48;
                    if (!_didIteratorError1) {
                        _ctx.next = 51;
                        break;
                    }
                    throw _iteratorError1;
                case 51:
                    return _ctx.finish(48);
                case 52:
                    return _ctx.finish(43);
                case 53:
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
            ],
            [
                28,
                39,
                43,
                53
            ],
            [
                44,
                ,
                48,
                52
            ]
        ]);
    }));
    return _f1.apply(this, arguments);
}
function f2() {
    return _f2.apply(this, arguments);
}
function _f2() {
    _f2 = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        var y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value2;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    ;
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _ctx.prev = 2;
                    _iterator = _asyncIterator({
                    });
                case 4:
                    _ctx.next = 6;
                    return _awaitAsyncGenerator(_iterator.next());
                case 6:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx.sent).done)) {
                        _ctx.next = 11;
                        break;
                    }
                    {
                        _value = _step.value;
                        x = _value;
                    }
                case 8:
                    _iteratorAbruptCompletion = false;
                    _ctx.next = 4;
                    break;
                case 11:
                    _ctx.next = 17;
                    break;
                case 13:
                    _ctx.prev = 13;
                    _ctx.t0 = _ctx["catch"](2);
                    _didIteratorError = true;
                    _iteratorError = _ctx.t0;
                case 17:
                    _ctx.prev = 17;
                    _ctx.prev = 18;
                    if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                        _ctx.next = 22;
                        break;
                    }
                    _ctx.next = 22;
                    return _iteratorError.return();
                case 22:
                    _ctx.prev = 22;
                    if (!_didIteratorError) {
                        _ctx.next = 25;
                        break;
                    }
                    throw _iteratorError;
                case 25:
                    return _ctx.finish(22);
                case 26:
                    return _ctx.finish(17);
                case 27:
                    _iteratorAbruptCompletion2 = false, _didIteratorError2 = false;
                    _ctx.prev = 28;
                    _iterator2 = _asyncIterator({
                    });
                case 30:
                    _ctx.next = 32;
                    return _awaitAsyncGenerator(_iterator2.next());
                case 32:
                    if (!(_iteratorAbruptCompletion2 = !(_step2 = _ctx.sent).done)) {
                        _ctx.next = 37;
                        break;
                    }
                    {
                        _value2 = _step2.value;
                        y = _value2;
                    }
                case 34:
                    _iteratorAbruptCompletion2 = false;
                    _ctx.next = 30;
                    break;
                case 37:
                    _ctx.next = 43;
                    break;
                case 39:
                    _ctx.prev = 39;
                    _ctx.t1 = _ctx["catch"](28);
                    _didIteratorError2 = true;
                    _iteratorError2 = _ctx.t1;
                case 43:
                    _ctx.prev = 43;
                    _ctx.prev = 44;
                    if (!(_iteratorAbruptCompletion2 && _iterator2.return != null)) {
                        _ctx.next = 48;
                        break;
                    }
                    _ctx.next = 48;
                    return _iteratorError2.return();
                case 48:
                    _ctx.prev = 48;
                    if (!_didIteratorError2) {
                        _ctx.next = 51;
                        break;
                    }
                    throw _iteratorError2;
                case 51:
                    return _ctx.finish(48);
                case 52:
                    return _ctx.finish(43);
                case 53:
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
            ],
            [
                28,
                39,
                43,
                53
            ],
            [
                44,
                ,
                48,
                52
            ]
        ]);
    }));
    return _f2.apply(this, arguments);
}
