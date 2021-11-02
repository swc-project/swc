function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function foo(x) {
}
var c, i1, a, f = function(x) {
}, f2 = function(x, y) {
};
foo(1), foo(), f(1), f(), f2(1), f2(1, 2);
var C = function() {
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
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
c.foo(), c.foo(1), i1(), i1(1), i1.foo(1), i1.foo(1, 2), a(), a(1), a.foo(), a.foo(1);
var b = {
    foo: function(x) {
    },
    a: function(x, y) {
    },
    b: function(x) {
    }
};
b.foo(), b.foo(1), b.a(1), b.a(1, 2), b.b(), b.b(1);
