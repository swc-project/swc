function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
        for(var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
// (arg: { x: any, y: any }) => void
function f1(param) {
    var x = param.x, y = param.y;
}
f1({
    x: 1,
    y: 1
});
// (arg: { x: any, y?: number }) => void
function f2(param) {
    var x = param.x, _y = param.y, y = _y === void 0 ? 0 : _y;
}
f2({
    x: 1
});
f2({
    x: 1,
    y: 1
});
// (arg: { x?: number, y?: number }) => void
function f3(param) {
    var _x = param.x, x = _x === void 0 ? 0 : _x, _y = param.y, y = _y === void 0 ? 0 : _y;
}
f3({
});
f3({
    x: 1
});
f3({
    y: 1
});
f3({
    x: 1,
    y: 1
});
// (arg?: { x: number, y: number }) => void
function f4(param) {
    var ref = param === void 0 ? {
        x: 0,
        y: 0
    } : param, x = ref.x, y = ref.y;
}
f4();
f4({
    x: 1,
    y: 1
});
// (arg?: { x: number, y?: number }) => void
function f5(param) {
    var ref = param === void 0 ? {
        x: 0
    } : param, x = ref.x, _y = ref.y, y = _y === void 0 ? 0 : _y;
}
f5();
f5({
    x: 1
});
f5({
    x: 1,
    y: 1
});
// (arg?: { x?: number, y?: number }) => void
function f6(param) {
    var ref = param === void 0 ? {
    } : param, _x = ref.x, x = _x === void 0 ? 0 : _x, _y = ref.y, y = _y === void 0 ? 0 : _y;
}
f6();
f6({
});
f6({
    x: 1
});
f6({
    y: 1
});
f6({
    x: 1,
    y: 1
});
// (arg?: { a: { x?: number, y?: number } }) => void
function f7(param) {
    var ref = param === void 0 ? {
        a: {
        }
    } : param, _a = ref.a, _x = _a.x, x = _x === void 0 ? 0 : _x, _y = _a.y, y = _y === void 0 ? 0 : _y;
}
f7();
f7({
    a: {
    }
});
f7({
    a: {
        x: 1
    }
});
f7({
    a: {
        y: 1
    }
});
f7({
    a: {
        x: 1,
        y: 1
    }
});
// (arg: [any, any]) => void
function g1(param) {
    var _param = _slicedToArray(param, 2), x = _param[0], y = _param[1];
}
g1([
    1,
    1
]);
// (arg: [number, number]) => void
function g2(param) {
    var _param = _slicedToArray(param, 2), tmp = _param[0], x = tmp === void 0 ? 0 : tmp, tmp1 = _param[1], y = tmp1 === void 0 ? 0 : tmp1;
}
g2([
    1,
    1
]);
// (arg?: [number, number]) => void
function g3(param) {
    var ref = _slicedToArray(param === void 0 ? [
        0,
        0
    ] : param, 2), x = ref[0], y = ref[1];
}
g3();
g3([
    1,
    1
]);
// (arg?: [number, number]) => void
function g4(param) {
    var ref = _slicedToArray(param === void 0 ? [
        0
    ] : param, 2), x = ref[0], tmp = ref[1], y = tmp === void 0 ? 0 : tmp;
}
g4();
g4([
    1,
    1
]);
// (arg?: [number, number]) => void
function g5(param) {
    var ref = _slicedToArray(param === void 0 ? [] : param, 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, tmp2 = ref[1], y = tmp2 === void 0 ? 0 : tmp2;
}
g5();
g5([
    1,
    1
]);
