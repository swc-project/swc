import * as swcHelpers from "@swc/helpers";
function _templateObject() {
    var data = swcHelpers.taggedTemplateLiteral([
        ""
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
var _ref, _super_a;
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
C.z1 = swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C);
C.z2 = swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C);
C.z3 = swcHelpers.get(swcHelpers.getPrototypeOf(C), "f", C).call(C);
C.z4 = swcHelpers.get(swcHelpers.getPrototypeOf(C), "f", C).call(C);
C.z5 = swcHelpers.set(swcHelpers.getPrototypeOf(C.prototype), "a", 0, C, true);
C.z6 = swcHelpers.set(swcHelpers.getPrototypeOf(C.prototype), "a", swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C) + 1, C, true);
C.z7 = function() {
    swcHelpers.set(swcHelpers.getPrototypeOf(C.prototype), "a", 0, C, true);
}();
var ref;
C.z8 = (ref = [
    0
], swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C) = ref[0], ref);
var ref1, ref2;
C.z9 = (ref1 = [
    0
], ref2 = ref1[0], swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C) = ref2 === void 0 ? 0 : ref2, ref1);
var ref3;
C.z10 = (ref3 = [
    0
], swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C) = ref3.slice(0), ref3);
var ref4;
C.z11 = (ref4 = {
    x: 0
}, swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C) = ref4.x, ref4);
var ref5, ref6;
C.z12 = (ref5 = {
    x: 0
}, ref6 = ref5.x, swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C) = ref6 === void 0 ? 0 : ref6, ref5);
var _tmp;
C.z13 = (_tmp = {
    x: 0
}, swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C) = swcHelpers.extends({}, _tmp), _tmp);
C.z14 = swcHelpers.set(swcHelpers.getPrototypeOf(C.prototype), "a", swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C) + 1, C, true);
C.z15 = swcHelpers.set(swcHelpers.getPrototypeOf(C.prototype), "a", swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C) - 1, C, true);
C.z16 = swcHelpers.set(swcHelpers.getPrototypeOf(C.prototype), _ref = "a", swcHelpers.get(swcHelpers.getPrototypeOf(C), _ref, C) + 1, C, true);
C.z17 = (swcHelpers.set(swcHelpers.getPrototypeOf(C.prototype), "a", (_super_a = +swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C)) + 1, C, true), _super_a);
C.z18 = swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C)(_templateObject());
