//// [destructuringWithLiteralInitializers.ts]
// (arg: { x: any, y: any }) => void
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
function f1(param) {
    var x = param.x, y = param.y;
}
f1({
    x: 1,
    y: 1
});
// (arg: { x: any, y?: number }) => void
function f2(param) {
    var x = param.x, _param_y = param.y, y = _param_y === void 0 ? 0 : _param_y;
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
    var _param_x = param.x, x = _param_x === void 0 ? 0 : _param_x, _param_y = param.y, y = _param_y === void 0 ? 0 : _param_y;
}
f3({});
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
function f4() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        x: 0,
        y: 0
    }, x = _ref.x, y = _ref.y;
}
f4();
f4({
    x: 1,
    y: 1
});
// (arg?: { x: number, y?: number }) => void
function f5() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        x: 0
    }, x = _ref.x, _ref_y = _ref.y, y = _ref_y === void 0 ? 0 : _ref_y;
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
function f6() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, _ref_x = _ref.x, x = _ref_x === void 0 ? 0 : _ref_x, _ref_y = _ref.y, y = _ref_y === void 0 ? 0 : _ref_y;
}
f6();
f6({});
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
function f7() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        a: {}
    }, _ref_a = _ref.a, _ref_a_x = _ref_a.x, x = _ref_a_x === void 0 ? 0 : _ref_a_x, _ref_a_y = _ref_a.y, y = _ref_a_y === void 0 ? 0 : _ref_a_y;
}
f7();
f7({
    a: {}
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
    var _param = _sliced_to_array(param, 2), x = _param[0], y = _param[1];
}
g1([
    1,
    1
]);
// (arg: [number, number]) => void
function g2(param) {
    var _param = _sliced_to_array(param, 2), tmp = _param[0], x = tmp === void 0 ? 0 : tmp, tmp1 = _param[1], y = tmp1 === void 0 ? 0 : tmp1;
}
g2([
    1,
    1
]);
// (arg?: [number, number]) => void
function g3() {
    var _ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        0,
        0
    ], 2), x = _ref[0], y = _ref[1];
}
g3();
g3([
    1,
    1
]);
// (arg?: [number, number]) => void
function g4() {
    var _ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        0
    ], 2), x = _ref[0], tmp = _ref[1], y = tmp === void 0 ? 0 : tmp;
}
g4();
g4([
    1,
    1
]);
// (arg?: [number, number]) => void
function g5() {
    var _ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], 2), tmp = _ref[0], x = tmp === void 0 ? 0 : tmp, tmp1 = _ref[1], y = tmp1 === void 0 ? 0 : tmp1;
}
g5();
g5([
    1,
    1
]);
