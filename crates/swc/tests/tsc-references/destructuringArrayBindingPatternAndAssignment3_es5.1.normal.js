import _sliced_to_array from "@swc/helpers/lib/_sliced_to_array.js";
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
    var _param = _sliced_to_array(param, 2), a1 = _param[0], tmp6 = _param[1], b = tmp6 === void 0 ? a1 : tmp6;
})([
    1
]);
(function(param) {
    var _param = _sliced_to_array(param, 3), c1 = _param[0], tmp8 = _param[1], d = tmp8 === void 0 ? c1 : tmp8, tmp7 = _param[2], e1 = tmp7 === void 0 ? e1 : tmp7;
})([
    1
]);
(function(param) {
    var _param = _sliced_to_array(param, 4), f1 = _param[0], tmp11 = _param[1], g = tmp11 === void 0 ? f1 : tmp11, tmp9 = _param[2], h = tmp9 === void 0 ? i : tmp9, tmp10 = _param[3], i1 = tmp10 === void 0 ? f1 : tmp10;
})([
    1
]);
