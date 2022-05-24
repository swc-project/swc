import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = // @target: es2017
    // @noEmitHelpers: true
    _async_to_generator(function*() {
        // Legal to use 'await' in a type context.
        var v;
    });
    return _foo.apply(this, arguments);
}
