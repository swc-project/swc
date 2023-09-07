//// [thisTypeErrors.ts]
var N1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function() {
    function C2() {
        _class_call_check(this, C2);
    }
    return C2.foo = function(x) {}, C2;
})().y = void 0, function(N1) {
    Object.defineProperty(N1, "x", {
        enumerable: !0,
        get: function() {
            return x;
        },
        set: function(v) {
            x = v;
        }
    });
    var x, y = this;
    Object.defineProperty(N1, "y", {
        enumerable: !0,
        get: function() {
            return y;
        },
        set: function(v) {
            y = v;
        }
    });
}(N1 || (N1 = {}));
