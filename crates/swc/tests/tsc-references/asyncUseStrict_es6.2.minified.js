//// [asyncUseStrict_es6.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    return (_func = _async_to_generator(function*() {
        "use strict";
        yield p;
    })).apply(this, arguments);
}
