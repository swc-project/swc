import * as swcHelpers from "@swc/helpers";
let { x  } = swcHelpers.objectSpread({}, {}, {
    x: 0
}), { y  } = swcHelpers.objectSpread({
    y: 0
}, {}), { z , a , b  } = swcHelpers.objectSpread({
    z: 0
}, {
    a: 0,
    b: 0
}), { c , d , e , f , g  } = swcHelpers.objectSpread({}, swcHelpers.objectSpread({}, swcHelpers.objectSpread({}, {
    c: 0
}, {
    d: 0
}), {
    e: 0
}), {
    f: 0
});
