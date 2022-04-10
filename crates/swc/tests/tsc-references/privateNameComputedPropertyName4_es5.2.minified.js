import * as swcHelpers from "@swc/helpers";
var C1 = function() {
    function C1() {
        swcHelpers.classCallCheck(this, C1);
    }
    return C1.prototype.bar = function() {}, C1;
}(), C2 = function() {
    function C2() {
        swcHelpers.classCallCheck(this, C2);
    }
    return C2.bar = function() {}, C2;
}(), C3 = function() {
    swcHelpers.classCallCheck(this, C3);
};
C3.bar = "test";
