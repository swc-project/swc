// @target: ES5
// @lib: es5,es2015.promise
// @noEmitHelpers: true
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
const x = function() {
    var _ref = _async_to_generator(function*(i) {
        return yield someOtherFunction(i);
    });
    return function x(i) {
        return _ref.apply(this, arguments);
    };
}();
const x1 = function() {
    var _ref = _async_to_generator(function*(i) {
        return yield someOtherFunction(i);
    });
    return function x1(i) {
        return _ref.apply(this, arguments);
    };
}();
