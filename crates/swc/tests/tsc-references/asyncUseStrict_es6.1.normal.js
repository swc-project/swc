//// [asyncUseStrict_es6.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    _func = _async_to_generator(function*() {
        "use strict";
        var b = (yield p) || a;
    });
    return _func.apply(this, arguments);
}
