import * as swcHelpers from "@swc/helpers";
var i, C = function() {
    "use strict";
    function C(t, u) {
        swcHelpers.classCallCheck(this, C), this.t = t, this.u = u;
    }
    return swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function(t, u) {
                return t;
            }
        },
        {
            key: "foo2",
            value: function(t, u) {
                return u;
            }
        },
        {
            key: "foo3",
            value: function(t, u) {
                return t;
            }
        },
        {
            key: "foo4",
            value: function(t, u) {
                return t;
            }
        },
        {
            key: "foo5",
            value: function(t, u) {
                return t;
            }
        },
        {
            key: "foo6",
            value: function() {}
        },
        {
            key: "foo7",
            value: function(u) {}
        },
        {
            key: "foo8",
            value: function() {}
        }
    ]), C;
}(), c = new C("", 1);
c.foo("", 1), c.foo2("", 1), c.foo3(!0, 1), c.foo4("", !0), c.foo5(!0, 1), c.foo6(), c.foo7(""), c.foo8(), i.foo("", 1), i.foo2("", 1), i.foo3(!0, 1), i.foo4("", !0), i.foo5(!0, 1), i.foo6(), i.foo7(""), i.foo8();
