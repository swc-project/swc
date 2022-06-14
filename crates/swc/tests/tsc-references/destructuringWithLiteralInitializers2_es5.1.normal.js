import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
// @strict: true
function f00(param) {
    var _param = _sliced_to_array(param, 2), x = _param[0], y = _param[1];
}
function f01() {
    var ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], 2), x = ref[0], y = ref[1];
}
function f02() {
    var ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        1
    ], 2), x = ref[0], y = ref[1];
}
function f03() {
    var ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        1,
        "foo"
    ], 2), x = ref[0], y = ref[1];
}
function f10(param) {
    var _param = _sliced_to_array(param, 2), tmp = _param[0], x = tmp === void 0 ? 0 : tmp, y = _param[1];
}
function f11() {
    var ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, y = ref[1];
}
function f12() {
    var ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        1
    ], 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, y = ref[1];
}
function f13() {
    var ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        1,
        "foo"
    ], 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, y = ref[1];
}
function f20(param) {
    var _param = _sliced_to_array(param, 2), tmp = _param[0], x = tmp === void 0 ? 0 : tmp, tmp1 = _param[1], y = tmp1 === void 0 ? "bar" : tmp1;
}
function f21() {
    var ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, tmp2 = ref[1], y = tmp2 === void 0 ? "bar" : tmp2;
}
function f22() {
    var ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        1
    ], 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, tmp3 = ref[1], y = tmp3 === void 0 ? "bar" : tmp3;
}
function f23() {
    var ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        1,
        "foo"
    ], 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, tmp4 = ref[1], y = tmp4 === void 0 ? "bar" : tmp4;
}
function f30(param) {
    var _param = _sliced_to_array(param, 2), tmp = _param[0], x = tmp === void 0 ? 0 : tmp, tmp5 = _param[1], y = tmp5 === void 0 ? "bar" : tmp5;
}
function f31() {
    var ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, tmp6 = ref[1], y = tmp6 === void 0 ? "bar" : tmp6;
}
function f32() {
    var ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        nx
    ], 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, tmp7 = ref[1], y = tmp7 === void 0 ? "bar" : tmp7;
}
function f33() {
    var ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        nx,
        sx
    ], 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, tmp8 = ref[1], y = tmp8 === void 0 ? "bar" : tmp8;
}
function f40(param) {
    var _param = _sliced_to_array(param, 2), tmp = _param[0], x = tmp === void 0 ? 0 : tmp, tmp9 = _param[1], y = tmp9 === void 0 ? "bar" : tmp9;
}
function f41() {
    var ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, tmp10 = ref[1], y = tmp10 === void 0 ? "bar" : tmp10;
}
function f42() {
    var ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        sx
    ], 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, tmp11 = ref[1], y = tmp11 === void 0 ? "bar" : tmp11;
}
function f43() {
    var ref = _sliced_to_array(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
        sx,
        nx
    ], 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, tmp12 = ref[1], y = tmp12 === void 0 ? "bar" : tmp12;
}
