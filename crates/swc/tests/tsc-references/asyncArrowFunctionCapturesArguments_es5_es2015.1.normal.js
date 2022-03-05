import * as swcHelpers from "@swc/helpers";
// @target: ES5
// @lib: es5,es2015.promise
// @noEmitHelpers: true
class C {
    method() {
        function other() {}
        var _this = this, _arguments = arguments;
        var fn = function() {
            var _ref = swcHelpers.asyncToGenerator(function*() {
                return yield other.apply(_this, _arguments);
            });
            return function fn() {
                return _ref.apply(this, arguments);
            };
        }();
    }
}
