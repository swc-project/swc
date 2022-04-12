import * as swcHelpers from "@swc/helpers";
try {
    throw [
        0,
        1
    ];
} catch (param) {
    var _param = swcHelpers.slicedToArray(param, 2);
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
    var ref = swcHelpers.slicedToArray(param2, 1)[0];
    swcHelpers.slicedToArray(ref.x, 1)[0], ref.z;
}
