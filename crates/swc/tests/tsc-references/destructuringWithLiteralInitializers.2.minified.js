//// [destructuringWithLiteralInitializers.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
function f4() {
    var _ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        x: 0,
        y: 0
    };
    _ref.x, _ref.y;
}
function f5() {
    var _ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        x: 0
    };
    _ref.x, _ref.y;
}
function f6() {
    var _ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    _ref.x, _ref.y;
}
function f7() {
    var _ref = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {
        a: {}
    }, _ref_a = _ref.a;
    _ref_a.x, _ref_a.y;
}
function g3() {
    var _ref = _sliced_to_array(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [
        0,
        0
    ], 2);
    _ref[0], _ref[1];
}
function g4() {
    var _ref = _sliced_to_array(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [
        0
    ], 2);
    _ref[0], _ref[1];
}
function g5() {
    var _ref = _sliced_to_array(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], 2);
    _ref[0], _ref[1];
}
!function(param) {
    param.x, param.y;
}({
    x: 1,
    y: 1
}), function(param) {
    param.x, param.y;
}({
    x: 1
}), function(param) {
    param.x, param.y;
}({
    x: 1,
    y: 1
}), function(param) {
    param.x, param.y;
}({}), function(param) {
    param.x, param.y;
}({
    x: 1
}), function(param) {
    param.x, param.y;
}({
    y: 1
}), function(param) {
    param.x, param.y;
}({
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
