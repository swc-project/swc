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
    _f1 = // @target: es2018,es2017,es2015,es5
    // @lib: esnext
    // @filename: file1.ts
    _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    ;
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _ctx.prev = 2;
                    _iterator = _asyncIterator(y);
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
    }));
    return _f1.apply(this, arguments);
}
function f2() {
    return _f2.apply(this, arguments);
}
function _f2() {
    _f2 = // @filename: file2.ts
    _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var x, y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    ;
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _ctx.prev = 2;
                    _iterator = _asyncIterator(y);
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
    }));
    return _f2.apply(this, arguments);
}
function f3() {
    return _f3.apply(this, arguments);
}
function _f3() {
    _f3 = // @filename: file3.ts
    _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        var y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    ;
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _ctx.prev = 2;
                    _iterator = _asyncIterator(y);
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
    }));
    return _f3.apply(this, arguments);
}
function f4() {
    return _f4.apply(this, arguments);
}
function _f4() {
    _f4 = // @filename: file4.ts
    _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        var x, y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    ;
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _ctx.prev = 2;
                    _iterator = _asyncIterator(y);
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
    }));
    return _f4.apply(this, arguments);
}
function f5() {
    return _f5.apply(this, arguments);
}
function _f5() {
    _f5 = // @filename: file5.ts
    // https://github.com/Microsoft/TypeScript/issues/21363
    _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    ;
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _ctx.prev = 2;
                    _iterator = _asyncIterator(y);
                case 4:
                    _ctx.next = 6;
                    return _iterator.next();
                case 6:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx.sent).done)) {
                        _ctx.next = 13;
                        break;
                    }
                    _value = _step.value;
                    x = _value;
                    return _ctx.abrupt("continue", 29);
                case 10:
                    _iteratorAbruptCompletion = false;
                    _ctx.next = 4;
                    break;
                case 13:
                    _ctx.next = 19;
                    break;
                case 15:
                    _ctx.prev = 15;
                    _ctx.t0 = _ctx["catch"](2);
                    _didIteratorError = true;
                    _iteratorError = _ctx.t0;
                case 19:
                    _ctx.prev = 19;
                    _ctx.prev = 20;
                    if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                        _ctx.next = 24;
                        break;
                    }
                    _ctx.next = 24;
                    return _iteratorError.return();
                case 24:
                    _ctx.prev = 24;
                    if (!_didIteratorError) {
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
    }));
    return _f5.apply(this, arguments);
}
function f6() {
    return _f6.apply(this, arguments);
}
function _f6() {
    _f6 = // @filename: file6.ts
    // https://github.com/Microsoft/TypeScript/issues/21363
    _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        var y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    ;
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _ctx.prev = 2;
                    _iterator = _asyncIterator(y);
                case 4:
                    _ctx.next = 6;
                    return _awaitAsyncGenerator(_iterator.next());
                case 6:
                    if (!(_iteratorAbruptCompletion = !(_step = _ctx.sent).done)) {
                        _ctx.next = 13;
                        break;
                    }
                    _value = _step.value;
                    x = _value;
                    return _ctx.abrupt("continue", 29);
                case 10:
                    _iteratorAbruptCompletion = false;
                    _ctx.next = 4;
                    break;
                case 13:
                    _ctx.next = 19;
                    break;
                case 15:
                    _ctx.prev = 15;
                    _ctx.t0 = _ctx["catch"](2);
                    _didIteratorError = true;
                    _iteratorError = _ctx.t0;
                case 19:
                    _ctx.prev = 19;
                    _ctx.prev = 20;
                    if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                        _ctx.next = 24;
                        break;
                    }
                    _ctx.next = 24;
                    return _iteratorError.return();
                case 24:
                    _ctx.prev = 24;
                    if (!_didIteratorError) {
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
    }));
    return _f6.apply(this, arguments);
}
function f7() {
    return _f7.apply(this, arguments);
}
function _f7() {
    _f7 = // @filename: file7.ts
    // https://github.com/microsoft/TypeScript/issues/36166
    _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        var y, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    ;
                case 1:
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _ctx.prev = 2;
                    _iterator = _asyncIterator(y);
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
    }));
    return _f7.apply(this, arguments);
}
