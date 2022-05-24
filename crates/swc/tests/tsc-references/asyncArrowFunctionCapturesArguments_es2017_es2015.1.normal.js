import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
// @target: es2017
// @noEmitHelpers: true
class C {
    method() {
        function other() {}
        var _this = this, _arguments = arguments;
        var fn = function() {
            var _ref = _async_to_generator(function*() {
                return yield other.apply(_this, _arguments);
            });
            return function fn() {
                return _ref.apply(this, arguments);
            };
        }();
    }
}
