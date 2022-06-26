import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var u, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.explicitThis = function(m) {
        return this.n + m;
    }, _proto.implicitThis = function(m) {
        return this.n + m;
    }, _proto.explicitVoid = function(m) {
        return m + 1;
    }, C;
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
