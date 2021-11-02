function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function foo(x) {
}
function foo2(x, y) {
}
foo(1), foo(), foo2(1), foo2(1, 2);
var c, i1, a, C = function() {
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
c.foo(), c.foo(1), c.foo2(1), c.foo2(1, 2), i1(), i1(1), i1(1, 2), i1.foo(1), i1.foo(1, 2), i1.foo(1, 2, 3), a(), a(1), a(1, 2), a.foo(1), a.foo(1, 2), a.foo(1, 2, 3);
