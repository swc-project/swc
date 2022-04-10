import * as swcHelpers from "@swc/helpers";
var C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
        var self = this;
        self.x = 1, self.m = function() {
            console.log(self.x);
        };
    }
    return C.prototype.mreal = function() {
        var self = this;
        self.y = 2;
    }, C;
}(), c = new C();
c.x, c.y, c.m();
