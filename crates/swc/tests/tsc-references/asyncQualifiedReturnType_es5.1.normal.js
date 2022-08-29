//// [asyncQualifiedReturnType_es5.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _wrap_native_super from "@swc/helpers/src/_wrap_native_super.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var X;
(function(X) {
    var MyPromise = /*#__PURE__*/ function(Promise1) {
        "use strict";
        _inherits(MyPromise, Promise1);
        var _super = _create_super(MyPromise);
        function MyPromise() {
            _class_call_check(this, MyPromise);
            return _super.apply(this, arguments);
        }
        return MyPromise;
    }(_wrap_native_super(Promise));
    X.MyPromise = MyPromise;
})(X || (X = {}));
function f() {
    return _f.apply(this, arguments);
}
function _f() {
    _f = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    });
    return _f.apply(this, arguments);
}
