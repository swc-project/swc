import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
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
    var _param = _sliced_to_array(param, 2), a = _param[0], tmp = _param[1], b = tmp === void 0 ? a : tmp;
})([
    1
]);
(function(param) {
    var _param = _sliced_to_array(param, 3), c = _param[0], tmp = _param[1], d = tmp === void 0 ? c : tmp, tmp1 = _param[2], e = tmp1 === void 0 ? e : tmp1;
})([
    1
]);
(function(param) {
    var _param = _sliced_to_array(param, 4), f = _param[0], tmp = _param[1], g = tmp === void 0 ? f : tmp, tmp1 = _param[2], h = tmp1 === void 0 ? i : tmp1, tmp2 = _param[3], i1 = tmp2 === void 0 ? f : tmp2;
})([
    1
]);
