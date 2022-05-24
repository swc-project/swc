import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
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
