// @target: es2017
// @noEmitHelpers: true
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
var foo = function() {
    var _ref = _async_to_generator(function*() {
        // Legal to use 'await' in a type context.
        var v;
    });
    return function foo() {
        return _ref.apply(this, arguments);
    };
}();
