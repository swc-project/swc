function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterableToArrayLimit(arr, i1) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
        for(var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i1 && _arr.length === i1) break;
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
function _slicedToArray(arr, i1) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i1) || _nonIterableRest();
}
var ref = [
    1
], a = ref[0], tmp = ref[1], b = tmp === void 0 ? a : tmp; // ok
var ref1 = [
    1
], c = ref1[0], tmp1 = ref1[1], d = tmp1 === void 0 ? c : tmp1, tmp2 = ref1[2], e = tmp2 === void 0 ? e : tmp2; // error for e = e
var ref2 = [
    1
], f = ref2[0], tmp3 = ref2[1], g = tmp3 === void 0 ? f : tmp3, tmp4 = ref2[2], h = tmp4 === void 0 ? i : tmp4, tmp5 = ref2[3], i = tmp5 === void 0 ? f : tmp5; // error for h = i
(function(param) {
    var _param = _slicedToArray(param, 2), a1 = _param[0], tmp6 = _param[1], b = tmp6 === void 0 ? a1 : tmp6;
})([
    1
]);
(function(param) {
    var _param = _slicedToArray(param, 3), c1 = _param[0], tmp8 = _param[1], d = tmp8 === void 0 ? c1 : tmp8, tmp7 = _param[2], e1 = tmp7 === void 0 ? e1 : tmp7;
})([
    1
]);
(function(param) {
    var _param = _slicedToArray(param, 4), f1 = _param[0], tmp11 = _param[1], g = tmp11 === void 0 ? f1 : tmp11, tmp9 = _param[2], h = tmp9 === void 0 ? i : tmp9, tmp10 = _param[3], i2 = tmp10 === void 0 ? f1 : tmp10;
})([
    1
]);
