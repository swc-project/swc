import * as swcHelpers from "@swc/helpers";
var i, a, C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.f = function() {
        var x;
        return x.getDate() + x.getDate();
    }, C;
}();
new C().f(), i.foo.getDate(), i.foo.getDate(), a().getDate(), a().getDate(), ({
    foo: function(x) {
        return x.getDate() + x.getDate();
    }
}).foo(new Date());
