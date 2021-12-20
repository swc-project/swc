function _throw(e) {
    throw e;
}
// Missing properties
function f1() {
    var ref7 = {
    }, x = ref7.x, y = ref7.y;
    var ref4 = {
    }, _x = ref4.x, x = _x === void 0 ? 1 : _x, y = ref4.y;
    var ref5 = {
    }, x = ref5.x, _y = ref5.y, y = _y === void 0 ? 1 : _y;
    var ref6 = {
    }, _x1 = ref6.x, x = _x1 === void 0 ? 1 : _x1, _y1 = ref6.y, y = _y1 === void 0 ? 1 : _y1;
}
var ref, ref1, ref2, ref3;
// Missing properties
function f2() {
    var x, y;
    var ref11;
    ref11 = {
    }, x = ref11.x, y = ref11.y, ref11;
    var ref8;
    ref8 = {
    }, ref = 1, x = ref, y = ref8.y, ref8;
    var ref9;
    ref9 = {
    }, x = ref9.x, ref1 = 1, y = ref1, ref9;
    var ref10;
    ref10 = {
    }, ref2 = 1, x = ref2, ref3 = 1, y = ref3, ref10;
}
// Excess properties
function f3() {
    var ref13 = {
        x: 0,
        y: 0
    }, ref13 = ref13 !== null ? ref13 : _throw(new TypeError("Cannot destructure undefined"));
    var x = {
        x: 0,
        y: 0
    }.x;
    var y = {
        x: 0,
        y: 0
    }.y;
    var ref12 = {
        x: 0,
        y: 0
    }, x = ref12.x, y = ref12.y;
}
// Excess properties
function f4() {
    var x, y;
    var ref15;
    ref15 = {
        x: 0,
        y: 0
    }, ref15;
    x = ({
        x: 0,
        y: 0
    }).x;
    y = ({
        x: 0,
        y: 0
    }).y;
    var ref14;
    ref14 = {
        x: 0,
        y: 0
    }, x = ref14.x, y = ref14.y, ref14;
}
