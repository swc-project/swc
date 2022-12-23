//// [destructuringCatch.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
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
} catch (param) {
    param.a, param.b;
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
} catch (param) {
    var _param_ = _sliced_to_array(param, 1)[0];
    _sliced_to_array(_param_.x, 1)[0], _param_.z;
}
