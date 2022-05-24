import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = // @target: ES5
    // @lib: es5,es2015.promise
    // @noEmitHelpers: true
    _async_to_generator(function*() {
        return;
    });
    return _foo.apply(this, arguments);
}
