//// [thisTypeErrors.ts]
var N1;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
(function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    return C2.foo = function(x) {}, C2;
})().y = void 0, function(N1) {
    var x;
    N1.y = this, N1.x = x;
}(N1 || (N1 = {}));
