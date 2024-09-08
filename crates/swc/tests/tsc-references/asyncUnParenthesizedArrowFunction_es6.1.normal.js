//// [asyncUnParenthesizedArrowFunction_es6.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
const x = /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function*(i) {
        return yield someOtherFunction(i);
    });
    return function x(i) {
        return _ref.apply(this, arguments);
    };
}();
const x1 = /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function*(i) {
        return yield someOtherFunction(i);
    });
    return function x1(i) {
        return _ref.apply(this, arguments);
    };
}();
