function _defineProperties(target, props) {
    for(var i1 = 0; i1 < props.length; i1++){
        var descriptor = props[i1];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function foo(x) {
}
function foo2(x, y) {
}
foo(1), foo(), foo2(1), foo2(1, 2);
var c, i, a, C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    }
    return Constructor = C, protoProps = [
        {
            key: "foo",
            value: function(x) {
            }
        },
        {
            key: "foo2",
            value: function(x, y) {
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
c.foo(), c.foo(1), c.foo2(1), c.foo2(1, 2), i(), i(1), i(1, 2), i.foo(1), i.foo(1, 2), i.foo(1, 2, 3), a(), a(1), a(1, 2), a.foo(1), a.foo(1, 2), a.foo(1, 2, 3);
