//// [destructuringArrayBindingPatternAndAssignment3.ts]
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
var _ref = [
    1
], a = _ref[0], tmp = _ref[1], b = tmp === void 0 ? a : tmp; // ok
var _ref1 = [
    1
], c = _ref1[0], tmp1 = _ref1[1], d = tmp1 === void 0 ? c : tmp1, tmp2 = _ref1[2], e = tmp2 === void 0 ? e : tmp2; // error for e = e
var _ref2 = [
    1
], f = _ref2[0], tmp3 = _ref2[1], g = tmp3 === void 0 ? f : tmp3, tmp4 = _ref2[2], h = tmp4 === void 0 ? i : tmp4, tmp5 = _ref2[3], i = tmp5 === void 0 ? f : tmp5; // error for h = i
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
    var _param = _sliced_to_array(param, 4), f = _param[0], tmp = _param[1], g = tmp === void 0 ? f : tmp, tmp1 = _param[2], h = tmp1 === void 0 ? i : tmp1, tmp2 = _param[3], i = tmp2 === void 0 ? f : tmp2;
})([
    1
]);
