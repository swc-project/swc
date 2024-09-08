//// [asyncArrowFunctionCapturesThis_es6.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
class C {
    method() {
        var _this = this;
        var fn = /*#__PURE__*/ function() {
            var _ref = _async_to_generator(function*() {
                return yield _this;
            });
            return function fn() {
                return _ref.apply(this, arguments);
            };
        }();
    }
}
