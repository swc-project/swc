//// [asyncArrowFunctionCapturesThis_es6.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
class C {
    method() {
        var _this = this;
        _async_to_generator(function*() {
            return yield _this;
        });
    }
}
