//// [destructuringControlFlow.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
function f1(obj) {
    obj.a && ((obj = {}).a, obj.a);
}
function f2(obj) {
    obj[0], obj[1];
    var _obj = _sliced_to_array(obj, 2);
    if (_obj[0], _obj[1], (ref = _sliced_to_array(obj, 2))[0], ref[1], obj[0] && obj[1]) {
        obj[0], obj[1];
        var ref, ref1, _obj1 = _sliced_to_array(obj, 2);
        _obj1[0], _obj1[1], (ref1 = _sliced_to_array(obj, 2))[0], ref1[1];
    }
}
function f3(obj) {
    if (obj.a && obj.b) {
        var ref;
        obj.a, obj.b, (ref = obj).a, ref.b;
    }
}
function f4() {
    0..x, 0..x, 0..x;
}
var ref = [
    "foo"
], key = ref[0], value = ref[1];
value.toUpperCase();
