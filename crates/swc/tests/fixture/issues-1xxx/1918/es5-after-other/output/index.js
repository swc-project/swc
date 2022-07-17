"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _defineProperty = require("@swc/helpers/lib/_define_property.js").default;
var _interopRequireDefault = require("@swc/helpers/lib/_interop_require_default.js").default;
var _regeneratorRuntime = /*#__PURE__*/ _interopRequireDefault(require("regenerator-runtime"));
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
    var counter, resolve, promise, iterable, res, _i, _iter, v, oldresolve;
    return _regeneratorRuntime.default.wrap(function _callee$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                counter = 0;
                ;
                promise = new Promise(function(r) {
                    return resolve = r;
                });
                iterable = _defineProperty({}, Symbol.asyncIterator, function() {
                    return {
                        next: function next() {
                            return promise;
                        }
                    };
                });
                res = _asyncToGenerator(_regeneratorRuntime.default.mark(function _callee() {
                    var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, value;
                    return _regeneratorRuntime.default.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _iteratorAbruptCompletion = false, _didIteratorError = false;
                                _ctx.prev = 1;
                                _iterator = _asyncIterator(iterable);
                            case 3:
                                _ctx.next = 5;
                                return _iterator.next();
                            case 5:
                                if (!(_iteratorAbruptCompletion = !(_step = _ctx.sent).done)) {
                                    _ctx.next = 10;
                                    break;
                                }
                                {
                                    _value = _step.value;
                                    value = _value;
                                    counter++;
                                    console.log(value);
                                }
                            case 7:
                                _iteratorAbruptCompletion = false;
                                _ctx.next = 3;
                                break;
                            case 10:
                                _ctx.next = 16;
                                break;
                            case 12:
                                _ctx.prev = 12;
                                _ctx.t0 = _ctx["catch"](1);
                                _didIteratorError = true;
                                _iteratorError = _ctx.t0;
                            case 16:
                                _ctx.prev = 16;
                                _ctx.prev = 17;
                                if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                                    _ctx.next = 21;
                                    break;
                                }
                                _ctx.next = 21;
                                return _iteratorError.return();
                            case 21:
                                _ctx.prev = 21;
                                if (!_didIteratorError) {
                                    _ctx.next = 24;
                                    break;
                                }
                                throw _iteratorError;
                            case 24:
                                return _ctx.finish(21);
                            case 25:
                                return _ctx.finish(16);
                            case 26:
                                if (!(counter !== 2)) {
                                    _ctx.next = 28;
                                    break;
                                }
                                throw new Error("");
                            case 28:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee, null, [
                        [
                            1,
                            12,
                            16,
                            26
                        ],
                        [
                            17,
                            ,
                            21,
                            25
                        ]
                    ]);
                }))();
                _i = 0, _iter = [
                    0,
                    1
                ];
            case 6:
                if (!(_i < _iter.length)) {
                    _ctx.next = 16;
                    break;
                }
                v = _iter[_i];
                _ctx.next = 10;
                return null;
            case 10:
                oldresolve = resolve;
                promise = new Promise(function(r) {
                    return resolve = r;
                });
                oldresolve({
                    value: v,
                    done: false
                });
            case 13:
                _i++;
                _ctx.next = 6;
                break;
            case 16:
                resolve({
                    value: undefined,
                    done: true
                });
                _ctx.next = 19;
                return res;
            case 19:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
}))();
