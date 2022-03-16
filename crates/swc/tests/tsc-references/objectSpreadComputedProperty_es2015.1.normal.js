import * as swcHelpers from "@swc/helpers";
// fixes #12200
function f() {
    let n = 12;
    let m = 13;
    let a = null;
    const o1 = swcHelpers.objectSpread({}, {}, {
        [n]: n
    });
    const o2 = swcHelpers.objectSpread({}, {}, {
        [a]: n
    });
    const o3 = swcHelpers.objectSpread({
        [a]: n
    }, {}, {
        [n]: n
    }, {}, {
        [m]: m
    });
}
