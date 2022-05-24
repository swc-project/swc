import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = // @target: ES6
    // @noEmitHelpers: true
    _async_to_generator(function*() {});
    return _foo.apply(this, arguments);
}
