//// [asyncArrowFunctionCapturesArguments_es6.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
class C {
    method() {
        function other() {}
        var _this = this, _arguments = arguments;
        _async_to_generator(function*() {
            return yield other.apply(_this, _arguments);
        });
    }
}
