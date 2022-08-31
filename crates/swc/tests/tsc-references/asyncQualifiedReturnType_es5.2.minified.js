//// [asyncQualifiedReturnType_es5.ts]
var X;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _wrap_native_super from "@swc/helpers/src/_wrap_native_super.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(X) {
    var MyPromise = function(Promise1) {
        "use strict";
        _inherits(MyPromise, Promise1);
        var _super = _create_super(MyPromise);
        function MyPromise() {
            return _class_call_check(this, MyPromise), _super.apply(this, arguments);
        }
        return MyPromise;
    }(_wrap_native_super(Promise));
    X.MyPromise = MyPromise;
}(X || (X = {}));
