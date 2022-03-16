import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function(B) {
    "use strict";
    swcHelpers.inherits(C, B);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        var _this;
        _this = _super.apply(this, arguments);
        // these should be unaffected
        _this.x = 1;
        _this.y = _this.x;
        _this.z = swcHelpers.get((swcHelpers.assertThisInitialized(_this), swcHelpers.getPrototypeOf(C.prototype)), "f", _this).call(_this);
        return _this;
    }
    return C;
}(B);
C.x = undefined;
C.y1 = C.x;
C.y2 = C.x();
C.y3 = C === null || C === void 0 ? void 0 : C.x();
C.y4 = C["x"]();
C.y5 = C === null || C === void 0 ? void 0 : C["x"]();
C.z3 = swcHelpers.get(swcHelpers.getPrototypeOf(C), "f", C).call(C);
C.z4 = swcHelpers.get(swcHelpers.getPrototypeOf(C), "f", C).call(C);
