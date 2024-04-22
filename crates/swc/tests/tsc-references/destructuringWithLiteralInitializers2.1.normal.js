//// [destructuringWithLiteralInitializers2.ts]
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
function f00(param) {
    var _param = _sliced_to_array(param, 2), x = _param[0], y = _param[1];
}
function f01() {
    var _ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], 2), x = _ref[0], y = _ref[1];
}
function f02() {
    var _ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        1
    ], 2), x = _ref[0], y = _ref[1];
}
function f03() {
    var _ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        1,
        'foo'
    ], 2), x = _ref[0], y = _ref[1];
}
function f10(param) {
    var _param = _sliced_to_array(param, 2), tmp = _param[0], x = tmp === void 0 ? 0 : tmp, y = _param[1];
}
function f11() {
    var _ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], 2), tmp = _ref[0], x = tmp === void 0 ? 0 : tmp, y = _ref[1];
}
function f12() {
    var _ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        1
    ], 2), tmp = _ref[0], x = tmp === void 0 ? 0 : tmp, y = _ref[1];
}
function f13() {
    var _ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        1,
        'foo'
    ], 2), tmp = _ref[0], x = tmp === void 0 ? 0 : tmp, y = _ref[1];
}
function f20(param) {
    var _param = _sliced_to_array(param, 2), tmp = _param[0], x = tmp === void 0 ? 0 : tmp, tmp1 = _param[1], y = tmp1 === void 0 ? 'bar' : tmp1;
}
function f21() {
    var _ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], 2), tmp = _ref[0], x = tmp === void 0 ? 0 : tmp, tmp1 = _ref[1], y = tmp1 === void 0 ? 'bar' : tmp1;
}
function f22() {
    var _ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        1
    ], 2), tmp = _ref[0], x = tmp === void 0 ? 0 : tmp, tmp1 = _ref[1], y = tmp1 === void 0 ? 'bar' : tmp1;
}
function f23() {
    var _ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        1,
        'foo'
    ], 2), tmp = _ref[0], x = tmp === void 0 ? 0 : tmp, tmp1 = _ref[1], y = tmp1 === void 0 ? 'bar' : tmp1;
}
function f30(param) {
    var _param = _sliced_to_array(param, 2), tmp = _param[0], x = tmp === void 0 ? 0 : tmp, tmp1 = _param[1], y = tmp1 === void 0 ? 'bar' : tmp1;
}
function f31() {
    var _ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], 2), tmp = _ref[0], x = tmp === void 0 ? 0 : tmp, tmp1 = _ref[1], y = tmp1 === void 0 ? 'bar' : tmp1;
}
function f32() {
    var _ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        nx
    ], 2), tmp = _ref[0], x = tmp === void 0 ? 0 : tmp, tmp1 = _ref[1], y = tmp1 === void 0 ? 'bar' : tmp1;
}
function f33() {
    var _ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        nx,
        sx
    ], 2), tmp = _ref[0], x = tmp === void 0 ? 0 : tmp, tmp1 = _ref[1], y = tmp1 === void 0 ? 'bar' : tmp1;
}
function f40(param) {
    var _param = _sliced_to_array(param, 2), tmp = _param[0], x = tmp === void 0 ? 0 : tmp, tmp1 = _param[1], y = tmp1 === void 0 ? 'bar' : tmp1;
}
function f41() {
    var _ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], 2), tmp = _ref[0], x = tmp === void 0 ? 0 : tmp, tmp1 = _ref[1], y = tmp1 === void 0 ? 'bar' : tmp1;
}
function f42() {
    var _ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        sx
    ], 2), tmp = _ref[0], x = tmp === void 0 ? 0 : tmp, tmp1 = _ref[1], y = tmp1 === void 0 ? 'bar' : tmp1;
}
function f43() {
    var _ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        sx,
        nx
    ], 2), tmp = _ref[0], x = tmp === void 0 ? 0 : tmp, tmp1 = _ref[1], y = tmp1 === void 0 ? 'bar' : tmp1;
}
