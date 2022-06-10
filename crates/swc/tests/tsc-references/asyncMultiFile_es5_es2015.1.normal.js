import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
function f() {
    return _f.apply(this, arguments);
}
function _f() {
    _f = // @target: es5
    // @lib: es5,es2015.promise
    // @filename: a.ts
    _async_to_generator(function*() {});
    return _f.apply(this, arguments);
}
// @filename: b.ts
function g() {}
