// @target: ES6
// @noEmitHelpers: true
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function*() {
        // Legal to use 'await' in a type context.
        var v;
    });
    return _foo.apply(this, arguments);
}
