import _sliced_to_array from "@swc/helpers/lib/_sliced_to_array.js";
try {
    throw [
        0,
        1
    ];
} catch (param) {
    var _param = _sliced_to_array(param, 2);
    _param[0], _param[1];
}
try {
    throw {
        a: 0,
        b: 1
    };
} catch (param1) {
    param1.a, param1.b;
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
    var ref = _sliced_to_array(param2, 1)[0];
    _sliced_to_array(ref.x, 1)[0], ref.z;
}
