import * as swcHelpers from "@swc/helpers";
// @target: ES5
// @lib: es5,es2015.promise
// @noEmitHelpers: true
class C {
    method() {
        var _this = this;
        var fn = function() {
            var _ref = swcHelpers.asyncToGenerator(function*() {
                return yield _this;
            });
            return function fn() {
                return _ref.apply(this, arguments);
            };
        }();
    }
}
