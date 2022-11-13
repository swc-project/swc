//// [missingAndExcessProperties.ts]
// Missing properties
import _object_destructuring_empty from "@swc/helpers/src/_object_destructuring_empty.mjs";
function f1() {
    var _ref = {}, x = _ref.x, y = _ref.y;
    var _ref1 = {}, _ref_x = _ref1.x, x = _ref_x === void 0 ? 1 : _ref_x, y = _ref1.y;
    var _ref2 = {}, x = _ref2.x, _ref_y = _ref2.y, y = _ref_y === void 0 ? 1 : _ref_y;
    var _ref3 = {}, _ref_x1 = _ref3.x, x = _ref_x1 === void 0 ? 1 : _ref_x1, _ref_y1 = _ref3.y, y = _ref_y1 === void 0 ? 1 : _ref_y1;
}
// Missing properties
function f2() {
    var x, y;
    var ref;
    ref = {}, x = ref.x, y = ref.y, ref;
    var ref1, ref2;
    ref1 = {}, ref2 = ref1.x, x = ref2 === void 0 ? 1 : ref2, y = ref1.y, ref1;
    var ref3, ref4;
    ref3 = {}, x = ref3.x, ref4 = ref3.y, y = ref4 === void 0 ? 1 : ref4, ref3;
    var ref5, ref6, ref7;
    ref5 = {}, ref6 = ref5.x, x = ref6 === void 0 ? 1 : ref6, ref7 = ref5.y, y = ref7 === void 0 ? 1 : ref7, ref5;
}
// Excess properties
function f3() {
    var ref = _object_destructuring_empty({
        x: 0,
        y: 0
    });
    var x = {
        x: 0,
        y: 0
    }.x;
    var y = {
        x: 0,
        y: 0
    }.y;
    var _ref = {
        x: 0,
        y: 0
    }, x = _ref.x, y = _ref.y;
}
// Excess properties
function f4() {
    var x, y;
    _object_destructuring_empty({
        x: 0,
        y: 0
    });
    x = ({
        x: 0,
        y: 0
    }).x;
    y = ({
        x: 0,
        y: 0
    }).y;
    var ref;
    ref = {
        x: 0,
        y: 0
    }, x = ref.x, y = ref.y, ref;
}
