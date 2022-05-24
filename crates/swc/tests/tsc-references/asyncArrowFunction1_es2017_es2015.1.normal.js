import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
// @target: es2017
// @noEmitHelpers: true
var foo = function() {
    var _ref = _async_to_generator(function*() {});
    return function foo() {
        return _ref.apply(this, arguments);
    };
}();
