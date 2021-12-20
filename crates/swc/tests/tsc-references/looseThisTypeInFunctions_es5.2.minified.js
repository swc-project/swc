function _defineProperties(target, props) {
    for(var i1 = 0; i1 < props.length; i1++){
        var descriptor = props[i1];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var u, C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    }
    return Constructor = C, protoProps = [
        {
            key: "explicitThis",
            value: function(m) {
                return this.n + m;
            }
        },
        {
            key: "implicitThis",
            value: function(m) {
                return this.n + m;
            }
        },
        {
            key: "explicitVoid",
            value: function(m) {
                return m + 1;
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}(), c = new C();
c.explicitVoid = c.explicitThis;
var o = {
    n: 101,
    explicitThis: function(m) {
        return m + this.n.length;
    },
    implicitThis: function(m) {
        return m;
    }
}, i = o;
(0, i.explicitThis)(12), (0, u.implicitNoThis)(12), c.explicitVoid = c.implicitThis, o.implicitThis = c.implicitThis, o.implicitThis = c.explicitThis, o.implicitThis = i.explicitThis, i.explicitThis = function(m) {
    return this.n.length;
};
