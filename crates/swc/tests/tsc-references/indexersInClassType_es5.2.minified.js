import * as swcHelpers from "@swc/helpers";
var C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.fn = function() {
        return this;
    }, C;
}(), r = new C().fn();
r[1], r.a;
