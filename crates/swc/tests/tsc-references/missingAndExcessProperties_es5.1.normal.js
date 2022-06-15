import _throw from "@swc/helpers/src/_throw.mjs";
// Missing properties
function f1() {
    var ref = {}, x = ref.x, y = ref.y;
    var ref1 = {}, _x = ref1.x, x = _x === void 0 ? 1 : _x, y = ref1.y;
    var ref2 = {}, x = ref2.x, _y = ref2.y, y = _y === void 0 ? 1 : _y;
    var ref3 = {}, _x1 = ref3.x, x = _x1 === void 0 ? 1 : _x1, _y1 = ref3.y, y = _y1 === void 0 ? 1 : _y1;
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
    var ref = {
        x: 0,
        y: 0
    }, ref = ref !== null ? ref : _throw(new TypeError("Cannot destructure undefined"));
    var x = {
        x: 0,
        y: 0
    }.x;
    var y = {
        x: 0,
        y: 0
    }.y;
    var ref1 = {
        x: 0,
        y: 0
    }, x = ref1.x, y = ref1.y;
}
// Excess properties
function f4() {
    var x, y;
    var ref;
    ref = {
        x: 0,
        y: 0
    }, ref;
    x = ({
        x: 0,
        y: 0
    }).x;
    y = ({
        x: 0,
        y: 0
    }).y;
    var ref1;
    ref1 = {
        x: 0,
        y: 0
    }, x = ref1.x, y = ref1.y, ref1;
}
