import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var i, a, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.f = function() {
        var x;
        return x.notHere() + x.notHere();
    }, C;
}();
new C().f(), i.foo.notHere(), i.foo.notHere(), a().notHere(), a().notHere();
var b = {
    foo: function(x) {
        return x.notHere() + x.notHere();
    },
    bar: b.foo().notHere()
};
b.foo(new Date());
