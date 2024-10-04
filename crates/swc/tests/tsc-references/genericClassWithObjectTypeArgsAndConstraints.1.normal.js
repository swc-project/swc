//// [genericClassWithObjectTypeArgsAndConstraints.ts]
// Generic call with constraints infering type parameter from object member properties
// No errors expected
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var D = function D() {
    "use strict";
    _class_call_check(this, D);
};
var X = function X() {
    "use strict";
    _class_call_check(this, X);
};
(function(Class) {
    var G = /*#__PURE__*/ function() {
        "use strict";
        function G() {
            _class_call_check(this, G);
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
            _class_call_check(this, G2);
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
var Class, Interface;
