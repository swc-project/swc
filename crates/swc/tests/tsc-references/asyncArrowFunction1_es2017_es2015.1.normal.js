import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
// @target: es2017
// @noEmitHelpers: true
var foo = function() {
    var _ref = _async_to_generator(function*() {});
    return function foo() {
        return _ref.apply(this, arguments);
    };
}();
