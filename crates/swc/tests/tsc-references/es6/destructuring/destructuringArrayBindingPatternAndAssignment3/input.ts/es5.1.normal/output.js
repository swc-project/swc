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
var ref = [
    1
], a1 = ref[0], tmp6 = ref[1], b = tmp6 === void 0 ? a1 : tmp6; // ok
var ref1 = [
    1
], c1 = ref1[0], tmp1 = ref1[1], d = tmp1 === void 0 ? c1 : tmp1, tmp2 = ref1[2], e1 = tmp2 === void 0 ? e1 : tmp2; // error for e = e
var ref2 = [
    1
], f1 = ref2[0], tmp3 = ref2[1], g = tmp3 === void 0 ? f1 : tmp3, tmp4 = ref2[2], h = tmp4 === void 0 ? i1 : tmp4, tmp5 = ref2[3], i1 = tmp5 === void 0 ? f1 : tmp5; // error for h = i
(function(param) {
    var _param = _slicedToArray(param, 2), a = _param[0], tmp = _param[1], b = tmp === void 0 ? a : tmp;
})([
    1
]);
(function(param) {
    var _param = _slicedToArray(param, 3), c = _param[0], tmp = _param[1], d = tmp === void 0 ? c : tmp, tmp7 = _param[2], e = tmp7 === void 0 ? e : tmp7;
})([
    1
]);
(function(param) {
    var _param = _slicedToArray(param, 4), f = _param[0], tmp = _param[1], g = tmp === void 0 ? f : tmp, tmp8 = _param[2], h = tmp8 === void 0 ? i1 : tmp8, tmp9 = _param[3], i = tmp9 === void 0 ? f : tmp9;
})([
    1
]);
