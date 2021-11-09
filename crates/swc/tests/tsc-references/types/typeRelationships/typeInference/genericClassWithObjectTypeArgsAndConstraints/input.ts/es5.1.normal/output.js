function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var D = function D() {
    "use strict";
    _classCallCheck(this, D);
};
var X = function X() {
    "use strict";
    _classCallCheck(this, X);
};
var Class;
(function(Class) {
    var G = /*#__PURE__*/ function() {
        "use strict";
        function G() {
            _classCallCheck(this, G);
        }
        _createClass(G, [
            {
                key: "foo",
                value: function foo(t, t2) {
                    var x;
                    return x;
                }
            }
        ]);
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
            _classCallCheck(this, G2);
        }
        _createClass(G2, [
            {
                key: "foo2",
                value: function foo2(t, t2) {
                    var x;
                    return x;
                }
            }
        ]);
        return G2;
    }();
    var g2;
    var r = g2.foo2(c1, d1);
    var r2 = g2.foo2(c1, c1);
})(Class || (Class = {
}));
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
})(Interface || (Interface = {
}));
