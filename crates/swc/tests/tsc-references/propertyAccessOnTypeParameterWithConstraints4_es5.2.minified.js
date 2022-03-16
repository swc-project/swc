import * as swcHelpers from "@swc/helpers";
var i, a, C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
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
