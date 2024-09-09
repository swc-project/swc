//// [asyncArrowFunction1_es6.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
var foo = /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function*() {});
    return function foo() {
        return _ref.apply(this, arguments);
    };
}();
