"use strict";
var _regeneratorRuntime = _interopRequireDefault(require("regenerator-runtime"));
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
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
_asyncToGenerator(_regeneratorRuntime.default.mark(function _callee() {
    var counter, resolve, promise, iterable, res, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, v, oldresolve;
    return _regeneratorRuntime.default.wrap(function _callee$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                counter = 0;
                ;
                promise = new Promise(function(r) {
                    return resolve = r;
                });
                iterable = _defineProperty({
                }, Symbol.asyncIterator, function() {
                    return {
                        next: function() {
                            return promise;
                        }
                    };
                });
                res = _asyncToGenerator(_regeneratorRuntime.default.mark(function _callee1() {
                    var _iteratorAbruptCompletion, _didIteratorError1, _iteratorError1, _iterator1, _step1, _value, value;
                    return _regeneratorRuntime.default.wrap(function _callee$1(_ctx1) {
                        while(1)switch(_ctx1.prev = _ctx1.next){
                            case 0:
                                _iteratorAbruptCompletion = false, _didIteratorError1 = false;
                                _ctx1.prev = 1;
                                _iterator1 = _asyncIterator(iterable);
                            case 3:
                                _ctx1.next = 5;
                                return _iterator1.next();
                            case 5:
                                if (!(_iteratorAbruptCompletion = !(_step1 = _ctx1.sent).done)) {
                                    _ctx1.next = 10;
                                    break;
                                }
                                {
                                    _value = _step1.value;
                                    value = _value;
                                    counter++;
                                    console.log(value);
                                }
                            case 7:
                                _iteratorAbruptCompletion = false;
                                _ctx1.next = 3;
                                break;
                            case 10:
                                _ctx1.next = 16;
                                break;
                            case 12:
                                _ctx1.prev = 12;
                                _ctx1.t0 = _ctx1["catch"](1);
                                _didIteratorError1 = true;
                                _iteratorError1 = _ctx1.t0;
                            case 16:
                                _ctx1.prev = 16;
                                _ctx1.prev = 17;
                                if (!(_iteratorAbruptCompletion && _iterator1.return != null)) {
                                    _ctx1.next = 21;
                                    break;
                                }
                                _ctx1.next = 21;
                                return _iteratorError1.return();
                            case 21:
                                _ctx1.prev = 21;
                                if (!_didIteratorError1) {
                                    _ctx1.next = 24;
                                    break;
                                }
                                throw _iteratorError1;
                            case 24:
                                return _ctx1.finish(21);
                            case 25:
                                return _ctx1.finish(16);
                            case 26:
                                if (!(counter !== 2)) {
                                    _ctx1.next = 28;
                                    break;
                                }
                                throw new Error('');
                            case 28:
                            case "end":
                                return _ctx1.stop();
                        }
                    }, _callee1, null, [
                        [
                            17,
                            ,
                            21,
                            25
                        ],
                        [
                            1,
                            12,
                            16,
                            26
                        ]
                    ]);
                }))();
                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                _ctx.prev = 6;
                _iterator = [
                    0,
                    1
                ][Symbol.iterator]();
            case 8:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    _ctx.next = 18;
                    break;
                }
                v = _step.value;
                _ctx.next = 12;
                return null;
            case 12:
                oldresolve = resolve;
                promise = new Promise(function(r) {
                    return resolve = r;
                });
                oldresolve({
                    value: v,
                    done: false
                });
            case 15:
                _iteratorNormalCompletion = true;
                _ctx.next = 8;
                break;
            case 18:
                _ctx.next = 24;
                break;
            case 20:
                _ctx.prev = 20;
                _ctx.t0 = _ctx["catch"](6);
                _didIteratorError = true;
                _iteratorError = _ctx.t0;
            case 24:
                _ctx.prev = 24;
                _ctx.prev = 25;
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            case 27:
                _ctx.prev = 27;
                if (!_didIteratorError) {
                    _ctx.next = 30;
                    break;
                }
                throw _iteratorError;
            case 30:
                return _ctx.finish(27);
            case 31:
                return _ctx.finish(24);
            case 32:
                resolve({
                    value: undefined,
                    done: true
                });
                _ctx.next = 35;
                return res;
            case 35:
            case "end":
                return _ctx.stop();
        }
    }, _callee, null, [
        [
            25,
            ,
            27,
            31
        ],
        [
            6,
            20,
            24,
            32
        ]
    ]);
}))();
