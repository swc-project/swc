//// [destructuringCatch.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
try {
    throw [
        0,
        1
    ];
} catch (param) {
    var _param, a, _param1 = _sliced_to_array(param, 2), a1 = _param1[0], b = _param1[1];
}
try {
    throw {
        a: 0,
        b: 1
    };
} catch (param1) {
    var a2 = param1.a, b1 = param1.b;
}
try {
    throw [
        {
            x: [
                0
            ],
            z: 1
        }
    ];
} catch (param2) {
    var _param2, _x, ref = _sliced_to_array(param2, 1)[0], y = _sliced_to_array(ref.x, 1)[0], z = ref.z;
}
