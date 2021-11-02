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
// @strict: true
function f00(param) {
    var _param = _slicedToArray(param, 2), x = _param[0], y = _param[1];
}
function f01(param) {
    var ref = _slicedToArray(param === void 0 ? [] : param, 2), x = ref[0], y = ref[1];
}
function f02(param) {
    var ref = _slicedToArray(param === void 0 ? [
        1
    ] : param, 2), x = ref[0], y = ref[1];
}
function f03(param) {
    var ref = _slicedToArray(param === void 0 ? [
        1,
        'foo'
    ] : param, 2), x = ref[0], y = ref[1];
}
function f10(param) {
    var _param = _slicedToArray(param, 2), tmp = _param[0], x = tmp === void 0 ? 0 : tmp, y = _param[1];
}
function f11(param) {
    var ref = _slicedToArray(param === void 0 ? [] : param, 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, y = ref[1];
}
function f12(param) {
    var ref = _slicedToArray(param === void 0 ? [
        1
    ] : param, 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, y = ref[1];
}
function f13(param) {
    var ref = _slicedToArray(param === void 0 ? [
        1,
        'foo'
    ] : param, 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, y = ref[1];
}
function f20(param) {
    var _param = _slicedToArray(param, 2), tmp = _param[0], x = tmp === void 0 ? 0 : tmp, tmp1 = _param[1], y = tmp1 === void 0 ? 'bar' : tmp1;
}
function f21(param) {
    var ref = _slicedToArray(param === void 0 ? [] : param, 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, tmp2 = ref[1], y = tmp2 === void 0 ? 'bar' : tmp2;
}
function f22(param) {
    var ref = _slicedToArray(param === void 0 ? [
        1
    ] : param, 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, tmp3 = ref[1], y = tmp3 === void 0 ? 'bar' : tmp3;
}
function f23(param) {
    var ref = _slicedToArray(param === void 0 ? [
        1,
        'foo'
    ] : param, 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, tmp4 = ref[1], y = tmp4 === void 0 ? 'bar' : tmp4;
}
function f30(param) {
    var _param = _slicedToArray(param, 2), tmp = _param[0], x = tmp === void 0 ? 0 : tmp, tmp5 = _param[1], y = tmp5 === void 0 ? 'bar' : tmp5;
}
function f31(param) {
    var ref = _slicedToArray(param === void 0 ? [] : param, 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, tmp6 = ref[1], y = tmp6 === void 0 ? 'bar' : tmp6;
}
function f32(param) {
    var ref = _slicedToArray(param === void 0 ? [
        nx
    ] : param, 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, tmp7 = ref[1], y = tmp7 === void 0 ? 'bar' : tmp7;
}
function f33(param) {
    var ref = _slicedToArray(param === void 0 ? [
        nx,
        sx
    ] : param, 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, tmp8 = ref[1], y = tmp8 === void 0 ? 'bar' : tmp8;
}
function f40(param) {
    var _param = _slicedToArray(param, 2), tmp = _param[0], x = tmp === void 0 ? 0 : tmp, tmp9 = _param[1], y = tmp9 === void 0 ? 'bar' : tmp9;
}
function f41(param) {
    var ref = _slicedToArray(param === void 0 ? [] : param, 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, tmp10 = ref[1], y = tmp10 === void 0 ? 'bar' : tmp10;
}
function f42(param) {
    var ref = _slicedToArray(param === void 0 ? [
        sx
    ] : param, 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, tmp11 = ref[1], y = tmp11 === void 0 ? 'bar' : tmp11;
}
function f43(param) {
    var ref = _slicedToArray(param === void 0 ? [
        sx,
        nx
    ] : param, 2), tmp = ref[0], x = tmp === void 0 ? 0 : tmp, tmp12 = ref[1], y = tmp12 === void 0 ? 'bar' : tmp12;
}
