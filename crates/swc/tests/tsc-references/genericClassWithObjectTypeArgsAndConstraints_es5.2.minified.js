function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
var Class, Interface, C = function() {
    "use strict";
    _classCallCheck(this, C);
}, D = function() {
    "use strict";
    _classCallCheck(this, D);
}, X = function() {
    "use strict";
    _classCallCheck(this, X);
};
!function(Class) {
    var g, g2, G = function() {
        "use strict";
        function G() {
            _classCallCheck(this, G);
        }
        return _createClass(G, [
            {
                key: "foo",
                value: function(t, t2) {
                }
            }
        ]), G;
    }(), c1 = new X(), d1 = new X();
    g.foo(c1, d1), g.foo(c1, c1);
    var G2 = function() {
        "use strict";
        function G2() {
            _classCallCheck(this, G2);
        }
        return _createClass(G2, [
            {
                key: "foo2",
                value: function(t, t2) {
                }
            }
        ]), G2;
    }();
    g2.foo2(c1, d1), g2.foo2(c1, c1);
}(Class || (Class = {
})), (function(Interface) {
    var g, g2, c1 = new X(), d1 = new X();
    g.foo(c1, d1), g.foo(c1, c1), g2.foo2(c1, d1), g2.foo2(c1, c1);
})(Interface || (Interface = {
}));
