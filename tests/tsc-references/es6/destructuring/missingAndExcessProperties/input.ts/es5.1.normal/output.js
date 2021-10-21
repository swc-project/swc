function _throw(e) {
    throw e;
}
// Missing properties
function f1() {
    var ref = {
    }, x = ref.x, y = ref.y;
    var ref4 = {
    }, _x = ref4.x, x = _x === void 0 ? 1 : _x, y = ref4.y;
    var ref5 = {
    }, x = ref5.x, _y = ref5.y, y = _y === void 0 ? 1 : _y;
    var ref6 = {
    }, _x1 = ref6.x, x = _x1 === void 0 ? 1 : _x1, _y1 = ref6.y, y = _y1 === void 0 ? 1 : _y1;
}
var ref7, ref1, ref2, ref3;
// Missing properties
function f2() {
    var x, y;
    var ref;
    ref = {
    }, x = ref.x, y = ref.y, ref;
    var ref8;
    ref8 = {
    }, ref7 = 1, x = ref7, y = ref8.y, ref8;
    var ref9;
    ref9 = {
    }, x = ref9.x, ref1 = 1, y = ref1, ref9;
    var ref10;
    ref10 = {
    }, ref2 = 1, x = ref2, ref3 = 1, y = ref3, ref10;
}
// Excess properties
function f3() {
    var ref = {
        x: 0,
        y: 0
    }, ref = ref !== null ? ref : _throw(new TypeError("Cannot destructure undefined"));
    var ref11 = {
        x: 0,
        y: 0
    }, x = ref11.x;
    var ref12 = {
        x: 0,
        y: 0
    }, y = ref12.y;
    var ref13 = {
        x: 0,
        y: 0
    }, x = ref13.x, y = ref13.y;
}
// Excess properties
function f4() {
    var x, y;
    var ref;
    ref = {
        x: 0,
        y: 0
    }, ref;
    var ref14;
    ref14 = {
        x: 0,
        y: 0
    }, x = ref14.x, ref14;
    var ref15;
    ref15 = {
        x: 0,
        y: 0
    }, y = ref15.y, ref15;
    var ref16;
    ref16 = {
        x: 0,
        y: 0
    }, x = ref16.x, y = ref16.y, ref16;
}
