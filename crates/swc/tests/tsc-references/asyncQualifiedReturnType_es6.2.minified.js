//// [asyncQualifiedReturnType_es6.ts]
var X;
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
function f() {
    return _f.apply(this, arguments);
}
function _f() {
    return (_f = _async_to_generator(function*() {})).apply(this, arguments);
}
(X || (X = {})).MyPromise = class extends Promise {
};
