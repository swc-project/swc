//// [asyncQualifiedReturnType_es6.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
var X;
(function(X) {
    class MyPromise extends Promise {
    }
    X.MyPromise = MyPromise;
})(X || (X = {}));
function f() {
    return _f.apply(this, arguments);
}
function _f() {
    _f = _async_to_generator(function*() {});
    return _f.apply(this, arguments);
}
