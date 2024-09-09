//// [asyncArrowFunction10_es6.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
var foo = /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function*() {
        // Legal to use 'await' in a type context.
        var v;
    });
    return function foo() {
        return _ref.apply(this, arguments);
    };
}();
