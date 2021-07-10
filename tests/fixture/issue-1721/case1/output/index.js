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
function _AwaitValue(value) {
    this.wrapped = value;
}
function _wrapAsyncGenerator(fn) {
    return function() {
        return new AsyncGenerator(fn.apply(this, arguments));
    };
}
function _lol() {
    _lol = _wrapAsyncGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return 1;
                case 2:
                    _ctx.next = 4;
                    return 2;
                case 4:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _lol.apply(this, arguments);
}
function lol() {
    return _lol.apply(this, arguments);
}
function _main() {
    _main = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, x;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _iteratorNormalCompletion = true, _didIteratorError = false;
                    _ctx.prev = 1;
                    _iterator = _asyncIterator(lol());
                case 3:
                    _ctx.next = 5;
                    return _iterator.next();
                case 5:
                    _step = _ctx.sent;
                    _iteratorNormalCompletion = _step.done;
                    _ctx.next = 9;
                    return _step.value;
                case 9:
                    _value = _ctx.sent;
                    if (!(0, !_iteratorNormalCompletion)) {
                        _ctx.next = 15;
                        break;
                    }
                    {
                        x = _value;
                        console.log(x);
                    }
                case 12:
                    _iteratorNormalCompletion = true;
                    _ctx.next = 3;
                    break;
                case 15:
                    _ctx.next = 21;
                    break;
                case 17:
                    _ctx.prev = 17;
                    _ctx.t0 = _ctx["catch"](1);
                    _didIteratorError = true;
                    _iteratorError = _ctx.t0;
                case 21:
                    _ctx.prev = 21;
                    _ctx.prev = 22;
                    if (!(!_iteratorNormalCompletion && _iterator.return != null)) {
                        _ctx.next = 26;
                        break;
                    }
                    _ctx.next = 26;
                    return _iteratorError.return();
                case 26:
                    _ctx.prev = 26;
                    if (!_didIteratorError) {
                        _ctx.next = 29;
                        break;
                    }
                    throw _iteratorError;
                case 29:
                    return _ctx.finish(26);
                case 30:
                    return _ctx.finish(21);
                case 31:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                22,
                ,
                26,
                30
            ],
            [
                1,
                17,
                21,
                31
            ]
        ]);
    }));
    return _main.apply(this, arguments);
}
function main() {
    return _main.apply(this, arguments);
}
main();
