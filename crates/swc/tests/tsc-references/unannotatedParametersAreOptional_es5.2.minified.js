import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C), this.p = function(x) {};
    }
    return C.prototype.m = function(x) {}, C.m = function(x) {}, C;
}();
C.m(), new C().m(), new C().p();
var obj = {
    m: function(x) {},
    p: function(x) {}
};
obj.m(), obj.p();
