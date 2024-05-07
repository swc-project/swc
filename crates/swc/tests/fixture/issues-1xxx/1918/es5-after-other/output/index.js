var _define_property = require("@swc/helpers/_/_define_property");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
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
_asyncToGenerator(function() {
    var counter, resolve, promise, iterable, res, _i, _iter, v, oldresolve;
    return _ts_generator._(this, function(_state) {
        switch(_state.label){
            case 0:
                counter = 0;
                promise = new Promise(function(r) {
                    return resolve = r;
                });
                iterable = _define_property._({}, Symbol.asyncIterator, function() {
                    return {
                        next: function next() {
                            return promise;
                        }
                    };
                });
                res = _asyncToGenerator(function() {
                    var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, value, err;
                    return _ts_generator._(this, function(_state) {
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
                                    _iteratorError.return()
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
                oldresolve({
                    value: v,
                    done: false
                });
                _state.label = 3;
            case 3:
                _i++;
                return [
                    3,
                    1
                ];
            case 4:
                resolve({
                    value: undefined,
                    done: true
                });
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
