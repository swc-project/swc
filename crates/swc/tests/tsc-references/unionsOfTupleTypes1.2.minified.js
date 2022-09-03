//// [unionsOfTupleTypes1.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
function f1(t1, t2, t3, t4, x) {
    var ref, ref1, ref2, ref3, _t1 = _sliced_to_array(t1, 3), _t2 = (_t1[0], _t1[1], _t1[2], _sliced_to_array(t2, 3)), _t3 = (_t2[0], _t2[1], _t2[2], _sliced_to_array(t3, 3)), _t4 = (_t3[0], _t3[1], _t3[2], _sliced_to_array(t4, 3));
    _t4[0], _t4[1], _t4[2], (ref = _sliced_to_array(t1, 3))[0], ref[1], ref[2], (ref1 = _sliced_to_array(t2, 3))[0], ref1[1], ref1[2], (ref2 = _sliced_to_array(t3, 3))[0], ref2[1], ref2[2], (ref3 = _sliced_to_array(t4, 3))[0], ref3[1], ref3[2], t1[0], t1[1], t1[2], t1[x], t2[0], t2[1], t2[2], t2[x], t3[0], t3[1], t3[2], t3[x], t4[0], t4[1], t4[2], t4[x], t1[1] = 42, t2[1] = 42, t3[1] = 42, t4[1] = 42;
}
var ex = [
    "hi"
], _ex = _sliced_to_array(ex, 2), x = _ex[0], y = _ex[1];
