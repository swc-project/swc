import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
// @target: es2017
// @noEmitHelpers: true
class C {
    method() {
        var _this = this;
        var fn = function() {
            var _ref = _async_to_generator(function*() {
                return yield _this;
            });
            return function fn() {
                return _ref.apply(this, arguments);
            };
        }();
    }
}
