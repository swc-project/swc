import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C), this.p = function(x) {};
    }
    return C.prototype.m = function(x) {}, C.m = function(x) {}, C;
}();
C.m(), new C().m(), new C().p();
var obj = {
    m: function(x) {},
    p: function(x) {}
};
obj.m(), obj.p();
