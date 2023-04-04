//// [destructuringArrayBindingPatternAndAssignment3.ts]
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
var tmp2 = [
    1
][2], e = void 0 === tmp2 ? e : tmp2;
!function(param) {
    var _param = _sliced_to_array(param, 2);
    _param[0], _param[1];
}([
    1
]), function(param) {
    var _param = _sliced_to_array(param, 3), tmp1 = (_param[0], _param[1], _param[2]), e = void 0 === tmp1 ? e : tmp1;
}([
    1
]), function(param) {
    var _param = _sliced_to_array(param, 4);
    _param[0], _param[1], _param[2], _param[3];
}([
    1
]);
