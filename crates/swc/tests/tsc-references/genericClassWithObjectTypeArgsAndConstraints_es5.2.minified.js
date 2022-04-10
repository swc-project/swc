import * as swcHelpers from "@swc/helpers";
var Class, Interface, C = function() {
    swcHelpers.classCallCheck(this, C);
}, D = function() {
    swcHelpers.classCallCheck(this, D);
}, X = function() {
    swcHelpers.classCallCheck(this, X);
};
!function(Class) {
    var g, g2, G = function() {
        function G() {
            swcHelpers.classCallCheck(this, G);
        }
        return G.prototype.foo = function(t, t2) {}, G;
    }(), c1 = new X(), d1 = new X();
    g.foo(c1, d1), g.foo(c1, c1);
    var G2 = function() {
        function G2() {
            swcHelpers.classCallCheck(this, G2);
        }
        return G2.prototype.foo2 = function(t, t2) {}, G2;
    }();
    g2.foo2(c1, d1), g2.foo2(c1, c1);
}(Class || (Class = {})), function(Interface) {
    var g, g2, c1 = new X(), d1 = new X();
    g.foo(c1, d1), g.foo(c1, c1), g2.foo2(c1, d1), g2.foo2(c1, c1);
}(Interface || (Interface = {}));
