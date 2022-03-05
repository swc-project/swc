import * as swcHelpers from "@swc/helpers";
var u, C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
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
    ]), C;
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
