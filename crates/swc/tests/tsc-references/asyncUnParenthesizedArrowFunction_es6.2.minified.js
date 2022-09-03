//// [asyncUnParenthesizedArrowFunction_es6.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
let x = function() {
    var _ref = _async_to_generator(function*(i) {
        return yield someOtherFunction(i);
    });
    return function(i) {
        return _ref.apply(this, arguments);
    };
}(), x1 = function() {
    var _ref = _async_to_generator(function*(i) {
        return yield someOtherFunction(i);
    });
    return function(i) {
        return _ref.apply(this, arguments);
    };
}();
