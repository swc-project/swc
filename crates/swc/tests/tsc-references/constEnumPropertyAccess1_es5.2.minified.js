import * as swcHelpers from "@swc/helpers";
!function(G) {
    G[G.A = 1] = "A", G[G.B = 2] = "B", G[G.C = 3] = "C", G[G.D = 2] = "D";
}(G || (G = {}));
var G, C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype[1] = function() {}, swcHelpers.createClass(C, [
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
