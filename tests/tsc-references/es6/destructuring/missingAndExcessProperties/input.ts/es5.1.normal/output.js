function _throw(e) {
    throw e;
}
// Missing properties
function f1() {
    var ref = {
    }, x = ref.x, y = ref.y;
    var ref1 = {
    }, _x = ref1.x, x = _x === void 0 ? 1 : _x, y = ref1.y;
    var ref2 = {
    }, x = ref2.x, _y = ref2.y, y = _y === void 0 ? 1 : _y;
    var ref3 = {
    }, _x1 = ref3.x, x = _x1 === void 0 ? 1 : _x1, _y1 = ref3.y, y = _y1 === void 0 ? 1 : _y1;
}
var ref, ref1, ref2, ref3;
// Missing properties
function f2() {
    var x, y;
    var ref5;
    ref5 = {
    }, x = ref5.x, y = ref5.y, ref5;
    var ref4;
    ref4 = {
    }, ref = 1, x = ref, y = ref4.y, ref4;
    var ref15;
    ref15 = {
    }, x = ref15.x, ref1 = 1, y = ref1, ref15;
    var ref16;
    ref16 = {
    }, ref2 = 1, x = ref2, ref3 = 1, y = ref3, ref16;
}
// Excess properties
function f3() {
    var ref16 = {
        x: 0,
        y: 0
    }, ref16 = ref16 !== null ? ref16 : _throw(new TypeError("Cannot destructure undefined"));
    var ref6 = {
        x: 0,
        y: 0
    }, x = ref6.x;
    var ref10 = {
        x: 0,
        y: 0
    }, y = ref10.y;
    var ref15 = {
        x: 0,
        y: 0
    }, x = ref15.x, y = ref15.y;
}
// Excess properties
function f4() {
    var x, y;
    var ref16;
    ref16 = {
        x: 0,
        y: 0
    }, ref16;
    var ref6;
    ref6 = {
        x: 0,
        y: 0
    }, x = ref6.x, ref6;
    var ref10;
    ref10 = {
        x: 0,
        y: 0
    }, y = ref10.y, ref10;
    var ref15;
    ref15 = {
        x: 0,
        y: 0
    }, x = ref15.x, y = ref15.y, ref15;
}
