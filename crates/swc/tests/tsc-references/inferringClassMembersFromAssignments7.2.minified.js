//// [inferringClassMembersFromAssignments7.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var c = new (/*#__PURE__*/ function() {
    function C() {
        _class_call_check(this, C);
        var self = this;
        self.x = 1, self.m = function() {
            console.log(self.x);
        };
    }
    return C.prototype.mreal = function() {
        this.y = 2;
    }, C;
}())();
c.x, c.y, c.m();
