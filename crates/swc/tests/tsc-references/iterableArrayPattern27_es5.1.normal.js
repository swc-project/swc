import * as swcHelpers from "@swc/helpers";
//@target: ES6
function takeFirstTwoEntries() {
    for(var _len = arguments.length, _tmp = new Array(_len), _key = 0; _key < _len; _key++){
        _tmp[_key] = arguments[_key];
    }
    var __tmp = swcHelpers.slicedToArray(_tmp, 2), ref = swcHelpers.slicedToArray(__tmp[0], 2), k1 = ref[0], v1 = ref[1], ref1 = swcHelpers.slicedToArray(__tmp[1], 2), k2 = ref1[0], v2 = ref1[1];
}
takeFirstTwoEntries.apply(void 0, swcHelpers.toConsumableArray(new Map([
    [
        "",
        0
    ],
    [
        "hello",
        1
    ]
])));
