import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
new (function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.f = function() {
        var x;
        return x.notHere() + x.notHere();
    }, C;
}())().f(), i.foo.notHere(), i.foo.notHere(), a().notHere(), a().notHere();
var i, a, b = {
    foo: function(x) {
        return x.notHere() + x.notHere();
    },
    bar: b.foo().notHere()
};
b.foo(new Date());
