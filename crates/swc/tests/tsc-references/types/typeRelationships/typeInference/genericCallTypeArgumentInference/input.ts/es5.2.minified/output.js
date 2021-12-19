function _defineProperties(target, props) {
    for(var i1 = 0; i1 < props.length; i1++){
        var descriptor = props[i1];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
"";
var i, C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C(t, u) {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C), this.t = t, this.u = u;
    }
    return Constructor = C, protoProps = [
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
            value: function() {
            }
        },
        {
            key: "foo7",
            value: function(u) {
            }
        },
        {
            key: "foo8",
            value: function() {
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}(), c = new C("", 1);
c.foo("", 1), c.foo2("", 1), c.foo3(!0, 1), c.foo4("", !0), c.foo5(!0, 1), c.foo6(), c.foo7(""), c.foo8(), i.foo("", 1), i.foo2("", 1), i.foo3(!0, 1), i.foo4("", !0), i.foo5(!0, 1), i.foo6(), i.foo7(""), i.foo8();
