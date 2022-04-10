import * as swcHelpers from "@swc/helpers";
var C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C), this.x = function(a) {};
    }
    return C.prototype.foo = function() {}, C;
}(), c = new C();
c.data = c.x(null), c.data = c.foo();
