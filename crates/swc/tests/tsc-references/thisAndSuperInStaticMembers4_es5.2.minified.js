import * as swcHelpers from "@swc/helpers";
var C = function(B) {
    swcHelpers.inherits(C, B);
    var _super = swcHelpers.createSuper(C);
    function C() {
        var _this;
        return swcHelpers.classCallCheck(this, C), _this = _super.apply(this, arguments), _this.x = 1, _this.y = _this.x, _this.z = swcHelpers.get((swcHelpers.assertThisInitialized(_this), swcHelpers.getPrototypeOf(C.prototype)), "f", _this).call(_this), _this;
    }
    return C;
}(B);
C.x = void 0, C.y1 = C.x, C.y2 = C.x(), C.y3 = null == C ? void 0 : C.x(), C.y4 = C.x(), C.y5 = null == C ? void 0 : C.x(), C.z3 = swcHelpers.get(swcHelpers.getPrototypeOf(C), "f", C).call(C), C.z4 = swcHelpers.get(swcHelpers.getPrototypeOf(C), "f", C).call(C);
