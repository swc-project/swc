"use strict";
var _async_iterator = require("@swc/helpers/lib/_async_iterator.js").default;
var _async_to_generator = require("@swc/helpers/lib/_async_to_generator.js").default;
var _define_property = require("@swc/helpers/lib/_define_property.js").default;
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _regeneratorRuntime = _interop_require_default(require("regenerator-runtime"));
_async_to_generator(_regeneratorRuntime.default.mark(function _callee1() {
    var counter, resolve, promise, iterable, res, _iteratorNormalCompletion, _didIteratorError1, _iteratorError1, _iterator1, _step1, v, oldresolve;
    return _regeneratorRuntime.default.wrap(function _callee$(_ctx1) {
        while(1)switch(_ctx1.prev = _ctx1.next){
            case 0:
                counter = 0;
                ;
                promise = new Promise(function(r) {
                    return resolve = r;
                });
                iterable = _define_property({}, Symbol.asyncIterator, function() {
                    return {
                        next: function next() {
                            return promise;
                        }
                    };
                });
                res = _async_to_generator(_regeneratorRuntime.default.mark(function _callee() {
                    var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, value;
                    return _regeneratorRuntime.default.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _iteratorAbruptCompletion = false, _didIteratorError = false;
                                _ctx.prev = 1;
                                _iterator = _async_iterator(iterable);
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
                                return _iterator.return();
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
                _iteratorNormalCompletion = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                _ctx1.prev = 6;
                _iterator1 = [
                    0,
                    1
                ][Symbol.iterator]();
            case 8:
                if (_iteratorNormalCompletion = (_step1 = _iterator1.next()).done) {
                    _ctx1.next = 18;
                    break;
                }
                v = _step1.value;
                _ctx1.next = 12;
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
                _ctx1.next = 8;
                break;
            case 18:
                _ctx1.next = 24;
                break;
            case 20:
                _ctx1.prev = 20;
                _ctx1.t0 = _ctx1["catch"](6);
                _didIteratorError1 = true;
                _iteratorError1 = _ctx1.t0;
            case 24:
                _ctx1.prev = 24;
                _ctx1.prev = 25;
                if (!_iteratorNormalCompletion && _iterator1.return != null) {
                    _iterator1.return();
                }
            case 27:
                _ctx1.prev = 27;
                if (!_didIteratorError1) {
                    _ctx1.next = 30;
                    break;
                }
                throw _iteratorError1;
            case 30:
                return _ctx1.finish(27);
            case 31:
                return _ctx1.finish(24);
            case 32:
                resolve({
                    value: undefined,
                    done: true
                });
                _ctx1.next = 35;
                return res;
            case 35:
            case "end":
                return _ctx1.stop();
        }
    }, _callee1, null, [
        [
            6,
            20,
            24,
            32
        ],
        [
            25,
            ,
            27,
            31
        ]
    ]);
}))();
