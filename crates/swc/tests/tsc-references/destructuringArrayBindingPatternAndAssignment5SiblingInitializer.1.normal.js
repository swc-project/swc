//// [destructuringArrayBindingPatternAndAssignment5SiblingInitializer.ts]
// To be inferred as `number`
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
function f1() {
    var _ref = [
        1
    ], a1 = _ref[0], tmp = _ref[1], b1 = tmp === void 0 ? a1 : tmp;
    var _ref1 = [
        1
    ], a2 = _ref1[0], tmp1 = _ref1[1], b2 = tmp1 === void 0 ? 1 + a2 : tmp1;
}
// To be inferred as `string`
function f2() {
    var _ref = [
        'hi'
    ], a1 = _ref[0], tmp = _ref[1], b1 = tmp === void 0 ? a1 : tmp;
    var _ref1 = [
        'hi'
    ], a2 = _ref1[0], tmp1 = _ref1[1], b2 = tmp1 === void 0 ? a2 + '!' : tmp1;
}
// To be inferred as `string | number`
function f3() {
    var a1 = 'hi', tmp = 1, b1 = tmp === void 0 ? a1 : tmp;
    var a2 = 'hi', tmp1 = 1, b2 = tmp1 === void 0 ? a2 + '!' : tmp1;
}
function f4() {
    var _ref = _sliced_to_array(yadda !== null && yadda !== void 0 ? yadda : [], 2), a = _ref[0], tmp = _ref[1], b = tmp === void 0 ? a : tmp;
}
