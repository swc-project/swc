//// [thisTypeErrors.ts]
var N1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
/*#__PURE__*/ (function() {
    function C2() {
        _class_call_check(this, C2);
    }
    return C2.foo = function(x) {}, C2;
})().y = void 0, function(N1) {
    N1.y = this;
}(N1 || (N1 = {}));
