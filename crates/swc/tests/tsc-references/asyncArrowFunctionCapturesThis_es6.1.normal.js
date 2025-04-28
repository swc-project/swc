//// [asyncArrowFunctionCapturesThis_es6.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
class C {
    method() {
        var fn = ()=>_async_to_generator(function*() {
                return yield this;
            }).call(this);
    }
}
