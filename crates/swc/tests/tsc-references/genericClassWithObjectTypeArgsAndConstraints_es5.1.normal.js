import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
var D = function D() {
    "use strict";
    swcHelpers.classCallCheck(this, D);
};
var X = function X() {
    "use strict";
    swcHelpers.classCallCheck(this, X);
};
var Class;
(function(Class) {
    var G = /*#__PURE__*/ function() {
        "use strict";
        function G() {
            swcHelpers.classCallCheck(this, G);
        }
        var _proto = G.prototype;
        _proto.foo = function foo(t, t2) {
            var x;
            return x;
        };
        return G;
    }();
    var c1 = new X();
    var d1 = new X();
    var g;
    var r = g.foo(c1, d1);
    var r2 = g.foo(c1, c1);
    var G2 = /*#__PURE__*/ function() {
        "use strict";
        function G2() {
            swcHelpers.classCallCheck(this, G2);
        }
        var _proto = G2.prototype;
        _proto.foo2 = function foo2(t, t2) {
            var x;
            return x;
        };
        return G2;
    }();
    var g2;
    var r = g2.foo2(c1, d1);
    var r2 = g2.foo2(c1, c1);
})(Class || (Class = {}));
var Interface;
(function(Interface) {
    var c1 = new X();
    var d1 = new X();
    var g;
    var r = g.foo(c1, d1);
    var r2 = g.foo(c1, c1);
    var g2;
    var r = g2.foo2(c1, d1);
    var r2 = g2.foo2(c1, c1);
})(Interface || (Interface = {}));
