// @target: esnext, es2022, es2015
// @useDefineForClassFields: false
// @noTypesAndSymbols: true
import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _set from "@swc/helpers/src/_set.mjs";
import _tagged_template_literal from "@swc/helpers/src/_tagged_template_literal.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
function _templateObject() {
    var data = _tagged_template_literal([
        ""
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
var _ref, _super_a;
var C = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        var _this;
        _this = _super.apply(this, arguments);
        // these should be unaffected
        _this.x = 1;
        _this.y = _this.x;
        _this.z = _get((_assert_this_initialized(_this), _get_prototype_of(C.prototype)), "f", _this).call(_this);
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
C.z1 = _get(_get_prototype_of(C), "a", C);
C.z2 = _get(_get_prototype_of(C), "a", C);
C.z3 = _get(_get_prototype_of(C), "f", C).call(C);
C.z4 = _get(_get_prototype_of(C), "f", C).call(C);
C.z5 = _set(_get_prototype_of(C.prototype), "a", 0, C, true);
C.z6 = _set(_get_prototype_of(C.prototype), "a", _get(_get_prototype_of(C), "a", C) + 1, C, true);
C.z7 = function() {
    _set(_get_prototype_of(C.prototype), "a", 0, C, true);
}();
var ref;
C.z8 = (ref = [
    0
], _get(_get_prototype_of(C), "a", C) = ref[0], ref);
var ref1, ref2;
C.z9 = (ref1 = [
    0
], ref2 = ref1[0], _get(_get_prototype_of(C), "a", C) = ref2 === void 0 ? 0 : ref2, ref1);
var ref3;
C.z10 = (ref3 = [
    0
], _get(_get_prototype_of(C), "a", C) = ref3.slice(0), ref3);
var ref4;
C.z11 = (ref4 = {
    x: 0
}, _get(_get_prototype_of(C), "a", C) = ref4.x, ref4);
var ref5, ref6;
C.z12 = (ref5 = {
    x: 0
}, ref6 = ref5.x, _get(_get_prototype_of(C), "a", C) = ref6 === void 0 ? 0 : ref6, ref5);
var _tmp;
C.z13 = (_tmp = {
    x: 0
}, _get(_get_prototype_of(C), "a", C) = _extends({}, _tmp), _tmp);
C.z14 = _set(_get_prototype_of(C.prototype), "a", _get(_get_prototype_of(C), "a", C) + 1, C, true);
C.z15 = _set(_get_prototype_of(C.prototype), "a", _get(_get_prototype_of(C), "a", C) - 1, C, true);
C.z16 = _set(_get_prototype_of(C.prototype), _ref = "a", _get(_get_prototype_of(C), _ref, C) + 1, C, true);
C.z17 = (_set(_get_prototype_of(C.prototype), "a", (_super_a = +_get(_get_prototype_of(C), "a", C)) + 1, C, true), _super_a);
C.z18 = _get(_get_prototype_of(C), "a", C)(_templateObject());
