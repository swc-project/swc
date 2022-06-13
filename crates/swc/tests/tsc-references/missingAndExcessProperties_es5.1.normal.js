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
    var ref4, ref5;
    ref4 = {}, ref5 = ref4.x, x = ref5 === void 0 ? 1 : ref5, y = ref4.y, ref4;
    var ref6, ref7;
    ref6 = {}, x = ref6.x, ref7 = ref6.y, y = ref7 === void 0 ? 1 : ref7, ref6;
    var ref8, ref9, ref10;
    ref8 = {}, ref9 = ref8.x, x = ref9 === void 0 ? 1 : ref9, ref10 = ref8.y, y = ref10 === void 0 ? 1 : ref10, ref8;
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
    var ref11 = {
        x: 0,
        y: 0
    }, x = ref11.x, y = ref11.y;
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
    var ref12;
    ref12 = {
        x: 0,
        y: 0
    }, x = ref12.x, y = ref12.y, ref12;
}
