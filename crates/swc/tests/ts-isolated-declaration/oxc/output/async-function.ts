// Correct
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
function asyncFunctionGood() {
    return _asyncFunctionGood.apply(this, arguments);
}
function _asyncFunctionGood() {
    _asyncFunctionGood = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    });
    return _asyncFunctionGood.apply(this, arguments);
}
var asyncFunctionGoo2 = function() {
    var _ref = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                Promise.resolve(0)
            ];
        });
    });
    return function asyncFunctionGoo2() {
        return _ref.apply(this, arguments);
    };
}();
function asyncFunction() {
    return _asyncFunction.apply(this, arguments);
}
function _asyncFunction() {
    _asyncFunction = // Need to explicit return type for async functions
    // Incorrect
    _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                42
            ];
        });
    });
    return _asyncFunction.apply(this, arguments);
}
var asyncFunction2 = function() {
    var _ref = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                "Hello, World!"
            ];
        });
    });
    return function asyncFunction2() {
        return _ref.apply(this, arguments);
    };
}();
