import * as swcHelpers from "@swc/helpers";
export var A = function() {
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return A.prototype.method = function() {
        return this;
    }, A;
}();
var Base = function(A) {
    swcHelpers.inherits(Base, A);
    var _super = swcHelpers.createSuper(Base);
    function Base() {
        return swcHelpers.classCallCheck(this, Base), _super.apply(this, arguments);
    }
    return Base.prototype.verify = function() {}, Base;
}(A);
export { Base as default };
