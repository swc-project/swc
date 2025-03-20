//// [asyncAwaitIsolatedModules_es6.ts]
var M;
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
!function(M) {
    function _f1() {
        return (_f1 = _async_to_generator(function*() {})).apply(this, arguments);
    }
    M.f1 = function() {
        return _f1.apply(this, arguments);
    };
}(M || (M = {}));
