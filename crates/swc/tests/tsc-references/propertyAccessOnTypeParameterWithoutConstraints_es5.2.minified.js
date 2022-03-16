import * as swcHelpers from "@swc/helpers";
var i, a, C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.f = function() {
        var x;
        return x.toString() + x.toString();
    }, C;
}();
new C().f(), i.foo.toString(), i.foo.toString(), a().toString(), a().toString(), ({
    foo: function(x) {
        return x.toString() + x.toString();
    }
}).foo(1);
