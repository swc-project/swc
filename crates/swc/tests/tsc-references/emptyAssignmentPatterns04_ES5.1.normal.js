//// [emptyAssignmentPatterns04_ES5.ts]
import _object_destructuring_empty from "@swc/helpers/src/_object_destructuring_empty.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
var a;
var x, y, z, a1, a2, a3;
var ref;
ref = _object_destructuring_empty(a), x = ref.x, y = ref.y, z = ref.z, ref;
var ref1, ref2;
ref2 = _sliced_to_array((ref1 = _sliced_to_array(a, 0), ref1), 3), a1 = ref2[0], a2 = ref2[1], a3 = ref2[2], ref2;
