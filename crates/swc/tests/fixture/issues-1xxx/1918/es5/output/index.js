"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _asyncIterator = require("@swc/helpers/lib/_async_iterator.js").default;
var _asyncToGenerator = require("@swc/helpers/lib/_async_to_generator.js").default;
var _defineProperty = require("@swc/helpers/lib/_define_property.js").default;
var _tsGenerator = require("@swc/helpers/lib/_ts_generator.js").default;
_asyncToGenerator(function() {
    var counter, resolve, promise, iterable, _tmp, res, _i, _iter, v, oldresolve, _tmp1, _tmp2;
    return _tsGenerator(this, function(_state) {
        switch(_state.label){
            case 0:
                counter = 0;
                promise = new Promise(function(r) {
                    return resolve = r;
                });
                _tmp = {};
                iterable = _defineProperty(_tmp, Symbol.asyncIterator, function() {
                    return {
                        next: function next() {
                            return promise;
                        }
                    };
                });
                res = _asyncToGenerator(function() {
                    var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, value, err;
                    return _tsGenerator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _iteratorAbruptCompletion = false, _didIteratorError = false;
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    6,
                                    7,
                                    12
                                ]);
                                _iterator = _asyncIterator(iterable);
                                _state.label = 2;
                            case 2:
                                return [
                                    4,
                                    _iterator.next()
                                ];
                            case 3:
                                if (!(_iteratorAbruptCompletion = !(_step = _state.sent()).done)) return [
                                    3,
                                    5
                                ];
                                _value = _step.value;
                                value = _value;
                                counter++;
                                console.log(value);
                                _state.label = 4;
                            case 4:
                                _iteratorAbruptCompletion = false;
                                return [
                                    3,
                                    2
                                ];
                            case 5:
                                return [
                                    3,
                                    12
                                ];
                            case 6:
                                err = _state.sent();
                                _didIteratorError = true;
                                _iteratorError = err;
                                return [
                                    3,
                                    12
                                ];
                            case 7:
                                _state.trys.push([
                                    7,
                                    ,
                                    10,
                                    11
                                ]);
                                if (!(_iteratorAbruptCompletion && _iterator.return != null)) return [
                                    3,
                                    9
                                ];
                                return [
                                    4,
                                    _iterator.return()
                                ];
                            case 8:
                                _state.sent();
                                _state.label = 9;
                            case 9:
                                return [
                                    3,
                                    11
                                ];
                            case 10:
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                                return [
                                    7
                                ];
                            case 11:
                                return [
                                    7
                                ];
                            case 12:
                                if (counter !== 2) {
                                    throw new Error("");
                                }
                                return [
                                    2
                                ];
                        }
                    });
                })();
                _i = 0, _iter = [
                    0,
                    1
                ];
                _state.label = 1;
            case 1:
                if (!(_i < _iter.length)) return [
                    3,
                    4
                ];
                v = _iter[_i];
                return [
                    4,
                    null
                ];
            case 2:
                _state.sent();
                oldresolve = resolve;
                promise = new Promise(function(r) {
                    return resolve = r;
                });
                _tmp1 = {};
                oldresolve((_tmp1.value = v, _tmp1.done = false, _tmp1));
                _state.label = 3;
            case 3:
                _i++;
                return [
                    3,
                    1
                ];
            case 4:
                _tmp2 = {};
                resolve((_tmp2.value = undefined, _tmp2.done = true, _tmp2));
                return [
                    4,
                    res
                ];
            case 5:
                _state.sent();
                return [
                    2
                ];
        }
    });
})();
