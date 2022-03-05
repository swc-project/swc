import * as swcHelpers from "@swc/helpers";
const { x  } = swcHelpers.objectSpread({}, {}, {
    x: 0
});
const { y  } = swcHelpers.objectSpread({
    y: 0
}, {});
const { z , a , b  } = swcHelpers.objectSpread({
    z: 0
}, {
    a: 0,
    b: 0
});
const { c , d , e , f , g  } = swcHelpers.objectSpread({}, swcHelpers.objectSpread({}, swcHelpers.objectSpread({}, {
    c: 0
}, {
    d: 0
}), {
    e: 0
}), {
    f: 0
});
