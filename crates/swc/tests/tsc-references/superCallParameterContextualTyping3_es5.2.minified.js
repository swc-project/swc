import * as swcHelpers from "@swc/helpers";
var CBase = function() {
    function CBase(param) {
        swcHelpers.classCallCheck(this, CBase);
    }
    return CBase.prototype.foo = function(param) {}, CBase;
}(), C = function(CBase) {
    swcHelpers.inherits(C, CBase);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        var _this = _super.call(this, {
            method: function(p) {
                p.length;
            }
        });
        return swcHelpers.get((swcHelpers.assertThisInitialized(_this), swcHelpers.getPrototypeOf(C.prototype)), "foo", _this).call(_this, {
            method: function(p) {
                p.length;
            }
        }), _this;
    }
    return C;
}(CBase);
