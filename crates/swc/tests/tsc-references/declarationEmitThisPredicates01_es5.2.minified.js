import * as swcHelpers from "@swc/helpers";
export var C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.m = function() {
        return swcHelpers._instanceof(this, D);
    }, C;
}();
export var D = function(C) {
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
    }
    return D;
}(C);
