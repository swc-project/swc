import * as swcHelpers from "@swc/helpers";
var A1 = function() {
    function A1() {
        swcHelpers.classCallCheck(this, A1);
    }
    return A1.prototype.fn = function(a) {
        return null;
    }, A1;
}(), B1 = function() {
    function B1() {
        swcHelpers.classCallCheck(this, B1);
    }
    return B1.prototype.fn = function(b) {
        return null;
    }, B1;
}(), Base = function() {
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    return Base.prototype.fn = function(b) {
        return null;
    }, Base;
}(), A2 = function(Base) {
    swcHelpers.inherits(A2, Base);
    var _super = swcHelpers.createSuper(A2);
    function A2() {
        return swcHelpers.classCallCheck(this, A2), _super.apply(this, arguments);
    }
    return A2;
}(Base), B2 = function(Base) {
    swcHelpers.inherits(B2, Base);
    var _super = swcHelpers.createSuper(B2);
    function B2() {
        return swcHelpers.classCallCheck(this, B2), _super.apply(this, arguments);
    }
    return B2;
}(Base);
