import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
// @target: ES5
// @lib: es5,es2015.promise
// @noEmitHelpers: true
class C {
    method() {
        function other() {}
        function fn() {
            return _fn.apply(this, arguments);
        }
        function _fn() {
            _fn = _async_to_generator(function*() {
                yield other.apply(this, arguments);
            });
            return _fn.apply(this, arguments);
        }
    }
}
