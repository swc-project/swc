//// [destructuringArrayBindingPatternAndAssignment3.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
var ref = [
    1
];
ref[0], ref[1];
var ref1 = [
    1
], tmp = (ref1[0], ref1[1], ref1[2]), e = void 0 === tmp ? e : tmp, ref2 = [
    1
];
ref2[0], ref2[1], ref2[2], ref2[3], function(param) {
    var _param = _sliced_to_array(param, 2);
    _param[0], _param[1];
}([
    1
]), function(param) {
    var _param = _sliced_to_array(param, 3), tmp = (_param[0], _param[1], _param[2]), e = void 0 === tmp ? e : tmp;
}([
    1
]), function(param) {
    var _param = _sliced_to_array(param, 4);
    _param[0], _param[1], _param[2], _param[3];
}([
    1
]);
