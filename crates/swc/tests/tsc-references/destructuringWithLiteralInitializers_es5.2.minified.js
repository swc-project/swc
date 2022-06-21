import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
function f2(param) {
    param.x, param.y;
}
function f3(param) {
    param.x, param.y;
}
function f4() {
    var ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        x: 0,
        y: 0
    };
    ref.x, ref.y;
}
function f5() {
    var ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        x: 0
    };
    ref.x, ref.y;
}
function f6() {
    var ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    ref.x, ref.y;
}
function f7() {
    var ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        a: {}
    }, _a = ref.a;
    _a.x, _a.y;
}
function g3() {
    var ref = _sliced_to_array(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [
        0,
        0
    ], 2);
    ref[0], ref[1];
}
function g4() {
    var ref = _sliced_to_array(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [
        0
    ], 2);
    ref[0], ref[1];
}
function g5() {
    var ref = _sliced_to_array(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], 2);
    ref[0], ref[1];
}
!function(param) {
    param.x, param.y;
}({
    x: 1,
    y: 1
}), f2({
    x: 1
}), f2({
    x: 1,
    y: 1
}), f3({}), f3({
    x: 1
}), f3({
    y: 1
}), f3({
    x: 1,
    y: 1
}), f4(), f4({
    x: 1,
    y: 1
}), f5(), f5({
    x: 1
}), f5({
    x: 1,
    y: 1
}), f6(), f6({}), f6({
    x: 1
}), f6({
    y: 1
}), f6({
    x: 1,
    y: 1
}), f7(), f7({
    a: {}
}), f7({
    a: {
        x: 1
    }
}), f7({
    a: {
        y: 1
    }
}), f7({
    a: {
        x: 1,
        y: 1
    }
}), function(param) {
    var _param = _sliced_to_array(param, 2);
    _param[0], _param[1];
}([
    1,
    1
]), function(param) {
    var _param = _sliced_to_array(param, 2);
    _param[0], _param[1];
}([
    1,
    1
]), g3(), g3([
    1,
    1
]), g4(), g4([
    1,
    1
]), g5(), g5([
    1,
    1
]);
