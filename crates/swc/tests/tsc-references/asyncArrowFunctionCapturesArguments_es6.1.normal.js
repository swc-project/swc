//// [asyncArrowFunctionCapturesArguments_es6.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
class C {
    method() {
        function other() {}
        var _this = this, _arguments = arguments;
        var fn = /*#__PURE__*/ function() {
            var _ref = _async_to_generator(function*() {
                return yield other.apply(_this, _arguments);
            });
            return function fn() {
                return _ref.apply(this, arguments);
            };
        }();
    }
}
function f() {
    var _arguments = arguments;
    return /*#__PURE__*/ _async_to_generator(function*() {
        /*#__PURE__*/ return /*#__PURE__*/ _async_to_generator(function*() {
            return _arguments.length;
        });
    });
}
