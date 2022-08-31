//// [asyncUnParenthesizedArrowFunction_es6.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
!function() {
    var _ref = _async_to_generator(function*(i) {
        return yield someOtherFunction(i);
    });
    return function(i) {
        return _ref.apply(this, arguments);
    };
}();
