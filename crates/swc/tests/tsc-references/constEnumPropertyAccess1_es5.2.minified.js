import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
!function(G) {
    G[G.A = 1] = "A", G[G.B = 2] = "B", G[G.C = 3] = "C", G[G.D = 2] = "D";
}(G || (G = {}));
var G, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype[1] = function() {}, _create_class(C, [
        {
            key: 2,
            get: function() {
                return !0;
            }
        },
        {
            key: 2,
            set: function(x) {}
        }
    ]), C;
}();
